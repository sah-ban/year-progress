export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
      payload: "eyJkb21haW4iOiJ5ZWFyLml0c2Nhc2hsZXNzLmNvbSJ9",
      signature:
        "RBOMz3a8vVMCLzUDibg6gxGmKcDUt/fmcowcaF3MqT89mdvs+c6SyUD2ec1HXkLhqiVGr7+hrkqITSSPmpyYkhs=",
    },
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
    },
    baseBuilder: {
      allowedAddresses: ["0x06e5B0fd556e8dF43BC45f8343945Fb12C6C3E90"],
    },
  };

  return Response.json(config);
}
