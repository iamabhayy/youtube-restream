<template>
  <div>
    <MainNavBar />
    <div class="container">
      <div class="my-4">
        <h4>Settings</h4>
        <p>Lorem ipsum dolor consectetur adipisicing elit.</p>
      </div>

      <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <validation-provider
          name="Channel ID"
          :rules="{ required: true, min: 4 }"
          v-slot="validationContext">

          <b-form-group label="Channel ID" label-for="chid">
            <b-form-input
              id="chid"
              name="chid"
              v-model="form.channelId"
              :state="getValidationState(validationContext)"
              aria-describedby="chid-live-feedback" />

            <b-form-invalid-feedback id="chid-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <validation-provider
          name="RTMP Key"
          :rules="{ required: true, min: 4 }"
          v-slot="validationContext">

          <b-form-group label="RTMP Key" label-for="rtmp">
            <b-form-input
              id="rtmp"
              name="rtmp"
              v-model="form.rtmpKey"
              :state="getValidationState(validationContext)"
              aria-describedby="rtmp-live-feedback" />

            <b-form-invalid-feedback id="chid-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <validation-provider
          name="Youtube api key"
          :rules="{ required: true, min: 4 }"
          v-slot="validationContext">

          <b-form-group label="Youtube api key" label-for="ykey">
            <b-form-input
              id="ykey"
              name="ykey"
              v-model="form.apiKey"
              :state="getValidationState(validationContext)"
              aria-describedby="ykey-live-feedback" />

            <b-form-invalid-feedback id="ykey-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <validation-provider name="Stream resolution" :rules="{ required: true }" v-slot="validationContext">
          <b-form-group label="Stream resolution" label-for="scale">
            <b-form-select
              id="scale"
              name="scale"
              v-model="form.resolution"
              :options="scale"
              :state="getValidationState(validationContext)"
              aria-describedby="scale-live-feedback"
            ></b-form-select>

            <b-form-invalid-feedback id="scale-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <validation-provider name="Video Bitrate" :rules="{ required: true }" v-slot="validationContext">
          <b-form-group label="Video Bitrate" label-for="scale">
            <b-form-select
              id="vbitrate"
              name="vbitrate"
              v-model="form.videoBitrate"
              :options="vbitrate"
              :state="getValidationState(validationContext)"
              aria-describedby="vbitrate-live-feedback"
            ></b-form-select>

            <b-form-invalid-feedback id="vbitrate-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <validation-provider name="Audio Bitrate" :rules="{ required: true }" v-slot="validationContext">
          <b-form-group label="Audio Bitrate" label-for="scale">
            <b-form-select
              id="abitrate"
              name="abitrate"
              v-model="form.audioBitrate"
              :options="abitrate"
              :state="getValidationState(validationContext)"
              aria-describedby="abitrate-live-feedback"
            ></b-form-select>

            <b-form-invalid-feedback id="abitrate-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button class="ml-2" @click="resetForm()">Reset</b-button>
      </b-form>
    </validation-observer>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  middleware: "auth",
  data() {
    return {
      form: {
        channelId: "",
        apiKey: "",
        rtmpKey: '',
        resolution: "scale=1280:720",
        audioBitrate: "128K",
        videoBitrate: "2M",
        checked: [],
      },
      scale: [
        { text: "480p", value: "scale=640:480" },
        { text: "720p", value: "scale=1280:720" },
        { text: "1080p", value: "scale=1920:1080" },
      ],
      vbitrate: [
        "1M",
        "2M",
        "4M",
      ],
      abitrate: [
        "64K",
        "128K",
        "152K",
        "192K",
      ],
      show: true,
    };
  },

  components: {
    ValidationProvider
  },

  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.form = {
        name: null,
        food: null
      };

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    onSubmit() {
      alert("Form submitted!");
    }
  }
};
</script>