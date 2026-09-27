import Image from "next/image";


export default function Hero() {
    return (
        <div className="hero">
            <div className="hero-content">
                <div className="countdown">
                    {/* <div className="center"> */}

                    <div className="text">Days , Hours , Minutes , Seconds </div>
                    <div className="numCountdown">00 : 00 : 00 : 00</div>
                    {/* </div> */}
                </div>
                <div className="mainContent">
                    <h1 className="roadto">ROAD TO</h1>
                    <p className="extreme">XTREME</p>
                </div>
                <div className="mainimage">
                    <Image
                        className="img"
                        src="/assets/logos/bg.png"
                        alt="Background"
                        width={1920}
                        height={1080}
                    />
                </div>
                <div className="subcontent">
                    <p>Outthink the challenge. </p>
                    <p>Outcode the competition.</p>
                </div>
                <div className="bottom">
                    {/* <p>// 2.0</p> */}
                </div>
            </div>
        </div>
    );
}
