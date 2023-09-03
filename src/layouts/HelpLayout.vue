<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="headerImage text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          style="position: absolute"
        />
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
        <q-route-tab v-if="!isLoggedIn" to="/login" label="Login" icon="home" />
        <q-route-tab v-else to="/" label="Home" icon="home" />
        <q-route-tab to="/help" label="Support" icon="contact_support" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <h5 align="center">Help Pages</h5>
          <template v-for="(helpPage, index) in helpPages" :key="index">
            <q-item :to="'/help/' + helpPage.id" clickable>
              <q-item-section avatar>
                <q-icon :name="helpPage.icon" />
              </q-item-section>

              <q-item-section class="text-uppercase">
                {{ helpPage.title }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { auth } from "../boot/firebase";
import { ref } from "vue";

export default {
  data() {
    return {
      productName: "Aswerys",
      mode: ref(false),
      leftDrawerOpen: ref(false),
      isLoggedIn: auth.currentUser !== null,
      helpPages: [
        {
          id: 1,
          title: "Basic Info",
          icon: "info",
        },
        {
          id: 2,
          title: "Contact Info",
          icon: "phone",
        },
        {
          id: 3,
          title: "Payments",
          icon: "euro",
        },
        {
          id: 4,
          title: "Rules (& Email rules)",
          icon: "gavel",
        },
      ],
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
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
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
body {
  overflow: hidden;
}
.headerImage {
  background: url("../assets/topbar.png") 0 0 !important;
}
</style>
