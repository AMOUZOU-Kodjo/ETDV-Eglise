import React from "react";

const Inscription = () => {
  return (
    <>
      <div className="p-5 md:px-[5%] ">
        <form className=" p-8 rounded-xl flex flex-col justify-center items-center h-vh ">
          <h1 className="text-3xl mb-14 items-center text-center uppercase bold">
            Inscription
          </h1>
          <input
            type="text"
            placeholder="Nom & Prénom"
            className="input input-bordered focus:outline-none focus:ring-0  mb-4"
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered focus:outline-none focus:ring-0  mb-4"
            required
          />

          <input
            type="password"
            name=""
            placeholder="Password"
            className="input input-bordered focus:outline-none focus:ring-0  mb-4"
            required
          />
          <input
            type="password"
            name=""
            placeholder="Confirm your Password "
            className="input input-bordered focus:outline-none focus:ring-0  mb-4"
            required
          />

          <button
            type="submit"
            className={`btn border-bs-stone-500 bg-blue-700 hover:bg-accent hover:border-b-fuchsia-600  "opacity-50 cursor-not-allowed" : ""}`}
          >
            Souscription
          </button>
        </form>
      </div>
    </>
  );
};

export default Inscription;
