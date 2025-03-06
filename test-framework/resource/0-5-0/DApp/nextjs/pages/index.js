import { useState } from "react";
import Auth from "../components/Auth";

export default function Home({ serverMessage }) {
    return (
        <div>
            <h1>Mock SDK SSR DApp</h1>
            <p>Server Message: {serverMessage}</p>
            <Auth />
        </div>
    );
}

export async function getServerSideProps() {
    const response = await fetch(`http://localhost:${process.env.PORT}/api/auth`);
    const data = await response.json();

    return { props: { serverMessage: data.message } };
}
