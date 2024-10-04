
function inviteUsersToChannels() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];
  var values = sheet.getDataRange().getValues();

  // Department-Channel Mapping (Customize this section)
  var departmentChannels = {
    "Sales": ["C07HZUBFGJG", "C07G4QDUEMP", "C07MN84R2B1"] 
    // Add more departments and their channel IDs as needed
    // Example: "Marketing": ["C0XLZ123ABC", "C0DEA456GHI"] 
  };

  // Slack Token (Replace with your actual token)
  var slackToken = "xozb-7555273503351-7609573643280-vWG1uXAxiwCkXvxiGAZ1fKUl"; 

  for (var i = 1; i < values.length; i++) {
    var row = values[i];

    // Split the comma-separated departments into an array
    var departments = row[0].split(", ");
    // Extract user ID from the "Submitted by" column
    var submittedBy = row[1];
    var userIdMatch = submittedBy.match(/\(([^)]+)\)/);
    var userId = userIdMatch ? userIdMatch[1] : "";

    for (var k = 0; k < departments.length; k++) {
      var department = departments[k].trim();
      var channelIds = departmentChannels[department] || [];

      for (var j = 0; j < channelIds.length; j++) {
        var channelId = channelIds[j];
        try {
          // Make the Slack API call to invite the user
          var response = UrlFetchApp.fetch("https://slack.com/api/conversations.invite", {
            method: "post",
            headers: {
              "Authorization": "Bearer " + slackToken
            },
            payload: {
              "channel": channelId,
              "users": userId
            }
          });

          var jsonResponse = JSON.parse(response.getContentText());
          if (jsonResponse.ok) {
            Logger.log("Successfully invited user " + userId + " to channel " + channelId);
          } else {
            Logger.log("Error inviting user " + userId + " to channel " + channelId + ": " +
              jsonResponse.error);
          }
        } catch (error) {
          Logger.log("An error occurred: " + error);
        }
      }
    }
  }
}
