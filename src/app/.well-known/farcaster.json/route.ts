export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  const domain = request.headers.get("host")?.split(":")[0] || "";

  const oldAccountAssociation = {
    header:
      "eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
    payload: "eyJkb21haW4iOiJ5ZWFyLml0c2Nhc2hsZXNzLmNvbSJ9",
    signature:
      "RBOMz3a8vVMCLzUDibg6gxGmKcDUt/fmcowcaF3MqT89mdvs+c6SyUD2ec1HXkLhqiVGr7+hrkqITSSPmpyYkhs=",
  };

  const newAccountAssociation = {
    header:
      "eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
    payload: "eyJkb21haW4iOiJ5ZWFyLXByb2dyZXNzLnNhaGJhbi5kZXYifQ",
    signature:
      "hzMZRbv8OQjZGkzm4xpcxlRQYSH1+HAMNRhuSZhdi882BhzcGU0yHlqCJy1ligXneo/r7ef4KaBMbP39Zl2sjxw=",
  };

  const accountAssociation = domain === "year.itscashless.com" ? oldAccountAssociation : newAccountAssociation;

  const config = {
    accountAssociation,
    frame: {
      version: "1",
      name: "Year Progress",
      iconUrl: `${appUrl}/logo.png`,
      homeUrl: appUrl,
      buttonTitle: "View Year Progress",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#333333",
      description: "Track year progress",
      primaryCategory: "utility",
      webhookUrl: `${appUrl}/api/webhook`,
      canonicalDomain: "year-progress.sahban.dev",
    },
    baseBuilder: {
      allowedAddresses: ["0x06e5B0fd556e8dF43BC45f8343945Fb12C6C3E90"],
    },
  };

  return Response.json(config);
}
