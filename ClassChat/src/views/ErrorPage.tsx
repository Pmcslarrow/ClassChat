import { useRouteError } from "react-router-dom";

interface RouteError {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: Error;
    message: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;

  return (
    <div id="error-page" className="pad">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}