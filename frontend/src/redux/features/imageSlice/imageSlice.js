import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import hostname from "../../../hostname";

// Function to get JWT token from the store
const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  console.log("Fetching auth header with token:", token);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  imageUrl: null,
  loading: false,
  error: null,
};

// Action to upload the image
export const uploadImage = createAsyncThunk(
  "image/uploadImage",
  async ({ userId, imageBuffer }, { rejectWithValue, getState }) => {
    try {
      console.log("Preparing form data for image upload...");
      const formData = new FormData();
      const filename = imageBuffer.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("user_id", userId);
      formData.append("image_name", filename);
      formData.append("image", {
        uri: imageBuffer.uri,
        name: filename,
        type,
      });

      console.log(
        "Sending image upload request to:",
        `${hostname}/image/upload`
      );
      const response = await axios.post(`${hostname}/image/upload`, formData, {
        ...getAuthHeader(getState),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image upload successful, response:", response.data);
      // Here, we assume the server returns the URL of the uploaded image as `imageUrl`
      return response.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during the image upload");
    }
  }
);

// Slice
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    resetImageState: (state) => {
      console.log("Resetting image state...");
      state.imageUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        console.log("Image upload pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        console.log("Image upload fulfilled, URL:", action.payload);
        state.loading = false;
        state.imageUrl = action.payload; // Store the uploaded image URL
      })
      .addCase(uploadImage.rejected, (state, action) => {
        console.log("Image upload rejected, error:", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to upload image";
      });
  },
});

export const { resetImageState } = imageSlice.actions;

export default imageSlice.reducer;
