import AirService from "mock-air-service-sdk/dist/airkit.cjs.js";

export default async function handler(req, res) {
    const airService = new AirService({ partnerId: "server-partner" });
    await airService.init();

    res.status(200).json({ message: "Mock SDK Server-Side Ready!" });
}
