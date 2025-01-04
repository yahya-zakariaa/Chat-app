"use client";
import Link from "next/link";
import React from "react";

export default function internalServerError() {
  return (
    <section className="bg-[#000] w-full flex-grow h-full">
      <div className="py-10 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            500
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Internal Server Error
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Something's wrong. Please try again or contact our support.
          </p>
          <Link
            href={"/login"}
            className="inline-flex text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-md px-5 py-3 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to home page
          </Link>
        </div>
      </div>
    </section>
  );
}
