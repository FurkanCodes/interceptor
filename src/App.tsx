import React, { useState } from "react";
import api from "./ApiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MockAdapter from "axios-mock-adapter";
import JSONView from "react-json-view";
import { FaGithub } from "react-icons/fa";
import "./App.css"; // Import the stylesheet

const mock = new MockAdapter(api);

const sendApiRequest = async (
  url: string,
  responsePayload: any | { status: number },
  responseType: "resultType" | "statusCode",
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);

  if (responseType === "resultType") {
    mock.onGet(url).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, responsePayload]);
        }, 1000); // Add a 1-second delay (adjust as needed)
      });
    });
  } else if (responseType === "statusCode") {
    mock.onGet(url).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([(responsePayload as any).status]);
        }, 1000); // Add a 1-second delay (adjust as needed)
      });
    });
  }

  try {
    const response = await api.get(url);
    setResult(response.data);
  } catch (error: any) {
    setResult({ error: error.message });
  } finally {
    setLoading(false);
    mock.resetHandlers();
  }
};

const App: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div className="app-container">
        <h1 className="header">React Axios Interceptors with Mock API</h1>
        <p className="paragraf">
          A simple app that mocks API requests to the backend. It utilizes
          interceptors. Click any button to mock a request, please take a look
          at API Response tab in order to see the response.
        </p>
        <div className="button-container">
          {["Ok", "Invalid", "Unexpected", "NotFound"].map((resultType) => (
            <button
              key={resultType}
              onClick={() =>
                sendApiRequest(
                  "/posts/1",
                  { resultType, messages: ["it works!"] },
                  "resultType",
                  setResult,
                  setLoading
                )
              }
            >
              {resultType}
            </button>
          ))}
        </div>

        <div className="button-container">
          {[400, 401, 403, 404, 500].map((statusCode) => (
            <button
              key={statusCode}
              onClick={() =>
                sendApiRequest(
                  "/status",
                  { status: statusCode },
                  "statusCode",
                  setResult,
                  setLoading
                )
              }
            >
              {`HTTP ${statusCode}`}
            </button>
          ))}
        </div>

        <ToastContainer />

        {loading && <p>Loading...</p>}

        {result && !loading && (
          <div className="response-container">
            <h2>API Response</h2>
            <JSONView src={result} theme="twilight" />
          </div>
        )}
      </div>
      <div className="github-icon-container">
        <a
          href="https://github.com/FurkanCodes/interceptor"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={20} />
        </a>
      </div>
    </>
  );
};

export default App;
