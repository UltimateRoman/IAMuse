/* eslint-disable react/jsx-key */
import { frames } from "@/app/frames/frames";
import { Button} from "frames.js/core";
import QRCode from "qrcode";

export const POST = frames(async (ctx) => {
    // Do something with the request data to generate transaction data
    if (!ctx.message) {
        console.log("Got No Message")
        throw new Error("No message");
    }

    const voteId = parseInt(ctx.message.inputText || "1");

    const gameId = ctx.searchParams.id

    const voteValue: string | boolean = ctx.searchParams.voteValue as string;

    const transactionLink = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}/promote/${gameId}`;

    const qrCodeDataURL = await QRCode.toDataURL(transactionLink);
    console.log(`QR: ${qrCodeDataURL}`)

    return {
        image: (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ff7e5f",
                    color: "#fff",
                    borderRadius: "10px",
                    textAlign: "center",
                    gap: "10px",
                }}
                tw="bg-gray-900 text-white text-[24px] shadow-lg rounded-md overflow-hidden"
            >
                <p style={{ fontSize: "50px", fontWeight: "bold" }}>
                    Scan the QR code or press the link below:
                </p>
                <img
                    src={qrCodeDataURL}
                    alt="Transaction QR Code"
                    style={{
                        width: "300px",
                        height: "300px",
                        marginTop: "10px",
                    }}
                />
            </div>
        ),
        buttons: [
            <Button action="link" target={transactionLink}>Tx Link</Button>,
            <Button action="post" target="/">Home</Button>,
        ]
    }
});
