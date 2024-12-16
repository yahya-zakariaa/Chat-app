import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/utils.js";
import cloudinary from "./../lib/cloudinary.js";
import nodemailer from "nodemailer";
import ResetCode from "../models/resetCode.modal.js";
import mongoose from "mongoose";

let failedLoginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000;

const incrementFailedAttempts = (email) => {
  if (!failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 0, time: Date.now() };
  }
  failedLoginAttempts[email].count += 1;
  failedLoginAttempts[email].time = Date.now();
};

const resetFailedAttempts = (email) => {
  failedLoginAttempts[email] = null;
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please fill in all required fields.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    generateJWT(newUser._id, res);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          username: newUser.username,
          email: newUser.email,
          avatar: null,
          createdAt: newUser.createdAt,
        },
      },
      message: "Account has been created successfully.",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoTimeoutError"
    ) {
      return res.status(500).json({
        status: "error",
        message: "Database connection error. Please try again later.",
      });
    }

    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists. Please use a different one.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong. Please try again later.",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide both email and password.",
    });
  }

  if (
    failedLoginAttempts[email] &&
    failedLoginAttempts[email].count >= MAX_ATTEMPTS
  ) {
    const timeLeft = LOCK_TIME - (Date.now() - failedLoginAttempts[email].time);
    if (timeLeft > 0) {
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

      let message = `Too many failed attempts. Please try again in `;
      if (minutesLeft > 0) {
        message += `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}`;
        if (secondsLeft > 0) {
          message += ` and ${secondsLeft} second${secondsLeft > 1 ? "s" : ""}`;
        }
      } else {
        message += `${secondsLeft} second${secondsLeft > 1 ? "s" : ""}`;
      }

      return res.status(429).json({
        status: "fail",
        message: message,
      });
    } else {
      resetFailedAttempts(email);
    }
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      incrementFailedAttempts(email);
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      incrementFailedAttempts(email);
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password.",
      });
    }

    resetFailedAttempts(email);

    const token = generateJWT(user._id, res);
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token.",
      });
    }

    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoTimeoutError"
    ) {
      return res.status(500).json({
        status: "error",
        message: "Database connection error. Please try again later.",
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong. Please try again later.",
    });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: "success", message: "Logged out" });
};

const checkAuth = (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
};

// password recovery controllers
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  if (!email) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide email" });
  }

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email not registretion" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(code);

    await ResetCode.create({
      userId: user._id,
      code: code,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "smtp.gmail.com",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title></title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]>-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
line-height: inherit;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (min-width: 481px) {
.hd { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t13,.t32{font-size:13px!important}.t10,.t16,.t48,.t70{width:480px!important}.t42,.t64{text-align:center!important}.t41,.t63{vertical-align:top!important;width:600px!important}.t36{width:337px!important}.t32{mso-text-raise:4px!important}.t13{mso-text-raise:5px!important}.t12{mso-line-height-alt:8px!important;line-height:8px!important}.t6{font-size:30px!important;mso-text-raise:7px!important}.t24{mso-line-height-alt:10px!important;line-height:10px!important}.t26{mso-line-height-alt:0!important;line-height:0!important;display:none!important}.t31{mso-line-height-alt:27px!important;line-height:27px!important}.t27{padding-top:2px!important}
}
</style>
<!--[if !mso]>-->
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700;800&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id=body class=t74 style="min-width:100%;Margin:0px;padding:0px;background-color:#F0F0F0;"><div class=t73 style="background-color:#F0F0F0;"><table role=presentation width=100% cellpadding=0 cellspacing=0 border=0 align=center><tr><td class=t72 style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#F0F0F0;" valign=top align=center>
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color=#F0F0F0/>
</v:background>
<![endif]-->
<table role=presentation width=100% cellpadding=0 cellspacing=0 border=0 align=center id=innerTable><tr><td align=center>
<table class=t49 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=600 class=t48 style="background-color:#FFFFFF;width:600px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t48 style="background-color:#FFFFFF;width:600px;">
<!--<![endif]-->
<table class=t47 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t46><div class=t45 style="width:100%;text-align:center;"><div class=t44 style="display:inline-block;"><table class=t43 role=presentation cellpadding=0 cellspacing=0 align=center valign=top>
<tr class=t42><td></td><td class=t41 width=600 valign=top>
<table role=presentation width=100% cellpadding=0 cellspacing=0 class=t40 style="width:100%;"><tr>
<td class=t39 style="background-color:transparent;"><table role=presentation width=100% cellpadding=0 cellspacing=0 style="width:100% !important;"><tr><td><div class=t1 style="mso-line-height-rule:exactly;mso-line-height-alt:125px;line-height:125px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t5 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=40 class=t4 style="width:40px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t4 style="width:40px;">
<!--<![endif]-->
<table class=t3 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t2><div style="font-size:0px;"><img class=t0 style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width=40 height=39.34375 alt="" src="https://888afe1e-886a-4049-9b47-7db12d635601.b-cdn.net/e/faf2a468-108c-4d9e-b2fa-507e5fca7057/4e32cf7e-1607-458e-b5d9-e03f7b7c5838.png"/></div></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t7 style="mso-line-height-rule:exactly;mso-line-height-alt:28px;line-height:28px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t11 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=507 class=t10 style="width:507px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t10 style="width:507px;">
<!--<![endif]-->
<table class=t9 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t8><h1 class=t6 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:52px;font-weight:700;font-style:normal;font-size:38px;text-decoration:none;text-transform:none;direction:ltr;color:#000000;text-align:center;mso-line-height-rule:exactly;mso-text-raise:4px;">Forgot your password?</h1></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t12 style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t17 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=528 class=t16 style="width:528px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t16 style="width:528px;">
<!--<![endif]-->
<table class=t15 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t14><p class=t13 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:500;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:4px;">this code to reset your password for the Nexus account ${
        user.email.slice(0, 3) +
        "*".repeat(user.email.indexOf("@") - 3) +
        user.email.slice(user.email.indexOf("@"))
      }</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t18 style="mso-line-height-rule:exactly;mso-line-height-alt:9px;line-height:9px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t23 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=350 class=t22 style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t22 style="width:350px;">
<!--<![endif]-->
<table class=t21 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t20><p class=t19 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:800;font-style:normal;font-size:25px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">Here is your code&nbsp;</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t24 style="mso-line-height-rule:exactly;mso-line-height-alt:11px;line-height:11px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td><div class=t26 style="mso-line-height-rule:exactly;mso-line-height-alt:5px;line-height:5px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t30 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=350 class=t29 style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t29 style="width:350px;">
<!--<![endif]-->
<table class=t28 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t27><p class=t25 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:800;font-style:normal;font-size:30px;text-decoration:none;text-transform:none;direction:ltr;color:#666666;text-align:center;mso-line-height-rule:exactly;">${code} </p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t31 style="mso-line-height-rule:exactly;mso-line-height-alt:15px;line-height:15px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td><div class=t33 style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t37 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=424 class=t36 style="width:424px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t36 style="width:424px;">
<!--<![endif]-->
<table class=t35 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t34><p class=t32 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:25px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#808080;text-align:center;mso-line-height-rule:exactly;mso-text-raise:3px;">If you do not want to change your password or didn&#39;t request a reset, you can ignore and delete this email.</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t38 style="mso-line-height-rule:exactly;mso-line-height-alt:33px;line-height:33px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr></table></td>
</tr></table>
</td>
<td></td></tr>
</table></div></div></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td align=center>
<table class=t71 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=600 class=t70 style="background-color:transparent;width:600px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t70 style="background-color:transparent;width:600px;">
<!--<![endif]-->
<table class=t69 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t68><div class=t67 style="width:100%;text-align:center;"><div class=t66 style="display:inline-block;"><table class=t65 role=presentation cellpadding=0 cellspacing=0 align=center valign=top>
<tr class=t64><td></td><td class=t63 width=600 valign=top>
<table role=presentation width=100% cellpadding=0 cellspacing=0 class=t62 style="width:100%;"><tr>
<td class=t61 style="background-color:transparent;padding:40px 0 40px 0;"><table role=presentation width=100% cellpadding=0 cellspacing=0 style="width:100% !important;"><tr><td align=center>
<table class=t54 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=350 class=t53 style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t53 style="width:350px;">
<!--<![endif]-->
<table class=t52 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t51><p class=t50 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:19px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#BBBBBB;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">Nexus is a wep applecation wich can you chat with your frinde where ever you want</p></td>
</tr></table>
</td>
</tr></table>
</td></tr><tr><td><div class=t55 style="mso-line-height-rule:exactly;mso-line-height-alt:20px;line-height:20px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align=center>
<table class=t60 role=presentation cellpadding=0 cellspacing=0 style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width=350 class=t59 style="width:350px;">
<![endif]-->
<!--[if !mso]>-->
<td class=t59 style="width:350px;">
<!--<![endif]-->
<table class=t58 role=presentation cellpadding=0 cellspacing=0 width=100% style="width:100%;"><tr>
<td class=t57><p class=t56 style="margin:0;Margin:0;font-family:Fira Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:19px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#BBBBBB;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">Nexus Inc. All rights reserved</p></td>
</tr></table>
</td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td>
<td></td></tr>
</table></div></div></td>
</tr></table>
</td>
</tr></table>
</td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
</html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ status: "error", message: "Failed to send email" });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ status: "success", message: "Email sent" });
    });
  } catch (error) {
    if (error.code === "EAUTH") {
      return res.status(400).json({
        status: "error",
        message: "Unable to send the email, check your email settings.",
      });
    }
    if (error.code === "ETIMEDOUT") {
      return res.status(400).json({
        status: "error",
        message: "Email sending timed out, please try again later.",
      });
    }
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

const verifyResetCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide code ",
    });
  }

  try {
    const resetCodeEntry = await ResetCode.findOne({ code });

    if (!resetCodeEntry) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid code",
      });
    }

    if (resetCodeEntry.expireAt < Date.now()) {
      return res.status(400).json({
        status: "failed",
        message: "Expired code",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Code verified",
      data: {
        userId: resetCodeEntry.userId,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { userId, password } = req.body;
  console.log(userId, password);

  if (!password || !userId) {
    return res.status(400).json({
      status: "fail",
      message: "client side error, please try again",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found, please check email failed",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

// user profile management controllers
const updateProfileAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    res.status(400).json({
      status: "fail",
      message: "Please provide avatar picture",
    });
  }

  try {
    const uploadRes = await cloudinary.uploader.upload(avatar);
    if (!uploadRes) {
      res.status(500).json({
        status: "fail",
        message: error.message || "something went wrong.",
      });
    }
    const userUpdated = await User.findByIdAndUpdate(
      _id,
      { avatar: uploadRes.secure_url },
      { new: true }
    ).select("-password");
    if (!userUpdated) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: userUpdated },
      message: "profile picutre updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

const updateProfileName = async (req, res) => {
  const { username } = req.body;
  const { _id } = req.user;
  if (!username) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username",
    });
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(
      _id,
      { username },
      { new: true }
    ).select("-password");
    if (!userUpdated) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: { user: userUpdated },
      message: "profile name updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "something went wrong.",
    });
  }
};

export {
  register,
  login,
  logout,
  updateProfileAvatar,
  checkAuth,
  updateProfileName,
  sendVerificationCode,
  verifyResetCode,
  resetPassword,
};
