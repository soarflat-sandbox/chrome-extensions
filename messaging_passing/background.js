chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.name === "Joseph") {
    const response = { data: "ツェペリの魂！！" };
    sendResponse(response);
  }
});