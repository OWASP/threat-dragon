<script setup>
import { ref, onMounted } from "vue";

// Ensure environment variables are defined
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY || '';
const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID || '';
const scope = "https://www.googleapis.com/auth/drive.file";

let accessToken = ref(null);
let tokenScopes = ref([]);

// Added google picker api, yet needs to be handled properly
const loadPickerAPI = () => {
  if (typeof gapi !== 'undefined') {
    gapi.load("picker", { callback: createPicker });
  } else {
    console.error("Google API not loaded");
  }
};

const handleAuth = () => {
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    console.error("Google OAuth2 not loaded");
    return;
  }

  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: scope,
    callback: (response) => {
      if (response.error) {
        console.error("OAuth Error:", response);
        return;
      }
      accessToken.value = response.access_token;
      tokenScopes.value = response.scope ? response.scope.split(" ") : [];
      createPicker();
    },
  });
  tokenClient.requestAccessToken();
};

const createPicker = () => {
  if (!accessToken.value || typeof google === 'undefined' || !google.picker) {
    console.error("Cannot create picker - missing requirements");
    return;
  }

  const picker = new google.picker.PickerBuilder()
    .addView(google.picker.ViewId.DOCS)
    .setOAuthToken(accessToken.value)
    .setDeveloperKey(apiKey)
    .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
};

const pickerCallback = async (data) => {
  if (!data || !data.action || !google.picker || data.action !== google.picker.Action.PICKED) {
    return;
  }

  const file = data.docs[0];
  if (file && file.mimeType === "application/json") {
    try {
      const fileContent = await fetchFileContent(file.id);
      sendToBackend(file.id, fileContent);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  } else {
    console.warn("Invalid file type selected. Please select a JSON file.");
  }
};

const fetchFileContent = async (fileId) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch file content");
  return await response.text();
};

const sendToBackend = async (fileId, fileContent) => {
  if (!accessToken.value) {
    console.error("No access token available. User may not be authenticated.");
    return;
  }
  try {
    const response = await fetch(`/api/googleproviderthreatmodel/${fileId}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.value}`
      },
      body: JSON.stringify({ fileId, fileContent }),
    });
    if (response.ok) {
      console.log("File imported successfully!");
    } else {
      const errorData = await response.json();
      console.error("Failed to import file:", errorData);
    }
  } catch (error) {
    console.error("Error sending file to backend:", error);
  }
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = loadPickerAPI;
  document.body.appendChild(script);

  const gisScript = document.createElement("script");
  gisScript.src = "https://accounts.google.com/gsi/client";
  document.body.appendChild(gisScript);
});
</script>

<template>
  <button @click="handleAuth" class="btn btn-primary">
    Open Google Picker
  </button>
</template>