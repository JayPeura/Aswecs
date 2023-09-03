<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="headerImage text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title
          align="center"
          style="font-family: 'Courier New', Courier, monospace"
        >
          <q-avatar>
            <img
              src="../assets/just_logo.png"
              style="background-color: rgb(233, 233, 233); padding: 5px"
            />
          </q-avatar>
          {{ productName }}
          <q-toggle
            icon="dark_mode"
            v-model="mode"
            style="position: absolute; right: 0"
            color="dark"
            name="darkModeToggle"
          />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/login" label="Login" icon="home" />
        <q-route-tab to="/help" label="Support" icon="contact_support" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  data() {
    return {
      productName: "Aswerys",
      mode: ref(false),
    };
  },
  watch: {
    mode(newMode, oldMode) {
      if (newMode) {
        this.$q.dark.set(true);
        window.localStorage.setItem("dark_mode", "on");
      } else {
        this.$q.dark.set(false);
        window.localStorage.setItem("dark_mode", "off");
      }
    },
  },
  methods: {
    toggleDarkMode() {
      const $q = useQuasar();

      if (this.mode) {
        window.localStorage.setItem("dark_mode", "on");
      } else {
        window.localStorage.setItem("dark_mode", "off");
      }

      $q.dark.set(this.mode);
    },
  },
  mounted() {
    const $q = useQuasar();

    if (window.localStorage.getItem("dark_mode") === "on") {
      $q.dark.set(true);
      this.mode = true;
    } else if (window.localStorage.getItem("dark_mode") === "off") {
      $q.dark.set(false);
      this.mode = false;
    } else {
      $q.dark.set(false);
      this.mode = false;
    }
  },
};
</script>

<style lang="scss">
.headerImage {
  background: url("../assets/topbar.png") 0 0 !important;
}
</style>
