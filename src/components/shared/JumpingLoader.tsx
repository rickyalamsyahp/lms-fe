export default function JumpingLoader() {
  return (
    <>
      <div>
        <div className="loader-demo-box">
          <div className="jumping-dots-loader">
            <span></span> <span></span> <span></span>
          </div>
        </div>
      </div>
      <style>{`
        .rounded,
        .loader-demo-box {
          border-radius: 0.25rem !important;
        }

        .loader-demo-box {
        }

        .jumping-dots-loader {
          border-radius: 100%;
          position: relative;
          margin: 0 auto;
        }

        .jumping-dots-loader span {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 100%;
          background-color: black;
          margin: 24px 1px;
        }

        .jumping-dots-loader span:nth-child(1) {
          animation: bounce 1s ease-in-out infinite;
        }

        .jumping-dots-loader span:nth-child(2) {
          animation: bounce 1s ease-in-out 0.33s infinite;
        }

        .jumping-dots-loader span:nth-child(3) {
          animation: bounce 1s ease-in-out 0.66s infinite;
        }

        @keyframes bounce {
          0%,
          75%,
          100% {
            -webkit-transform: translateY(0);
            -ms-transform: translateY(0);
            -o-transform: translateY(0);
            transform: translateY(0);
          }

          25% {
            -webkit-transform: translateY(-5px);
            -ms-transform: translateY(-5px);
            -o-transform: translateY(-5px);
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  )
}
