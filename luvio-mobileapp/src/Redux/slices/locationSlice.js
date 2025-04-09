import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosSlice";

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");

      const loc = await Location.getCurrentPositionAsync({});
      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;

      // Log the location data to debug
      console.log("Location data:", latitude, longitude);

      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      let area = "Unknown Area";
      if (geocode.length > 0) {
        const { street, district, name, city, region, subregion } = geocode[0];
        const locality = street || district || name || subregion || "Area";
        const cityName = city || region || "City";
        area = `${locality}, ${cityName}`;
      }

      // Fetch userId and authToken from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        console.warn(
          "Missing token/userId, skipping server update, returning only area"
        );
        return {
          area,
          coords: { lat: latitude, lon: longitude },
        };
      }

      // Update location on the server
      const response = await axiosInstance.post(
        `/Authentication/updatelocation`,
        {
          userId,
          location: {
            latitude,
            longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        area,
        coords: { lat: latitude, lon: longitude },
      };
    } catch (error) {
      // Log the error response for debugging
      console.error(
        "Error fetching location:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.message);
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    area: "",
    coords: { lat: null, lon: null },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.area = action.payload.area;
        state.coords = action.payload.coords;
        state.loading = false;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default locationSlice.reducer;
