// App.tsx
import React from "react";
import api from "./ApiService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MockAdapter from "axios-mock-adapter";

// init axios mock adapter
const mock = new MockAdapter(api);

const sendApiRequest = async (
  url: string,
  responsePayload: any | { status: number },
  responseType: "resultType" | "statusCode"
) => {
  // Mock response türüne göre
  if (responseType === "resultType") {
    mock.onGet(url).reply(200, responsePayload);
  } else if (responseType === "statusCode") {
    mock.onGet(url).reply((responsePayload as any).status);
  }

  try {
    console.log(responsePayload);
    await api.get(url);
  } catch (error) {
    console.error(error);
  } finally {
    mock.resetHandlers(); // Reset mock
  }
};

const App: React.FC = () => {
  return (
    <div>
      <h1>React Axios Interceptors with Mock API</h1>
      {["Ok", "Invalid", "Unexpected", "NotFound"].map((resultType) => (
        <button
          key={resultType}
          onClick={() =>
            sendApiRequest(
              "/posts/1",
              { resultType, messages: ["it works!"] },
              "resultType"
            )
          }
        >
          {resultType}
        </button>
      ))}
      {/* Buttons for different HTTP status codes */}
      {[400, 401, 403, 404, 500].map((statusCode) => (
        <button
          key={statusCode}
          onClick={() =>
            sendApiRequest("/status", { status: statusCode }, "statusCode")
          }
        >
          {`HTTP ${statusCode}`}
        </button>
      ))}
      <ToastContainer />
    </div>
  );
};

export default App;
