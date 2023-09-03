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
        <q-route-tab to="/" label="Home" icon="home" title="Frontpage" />
        <q-route-tab
          to="/store"
          label="Store"
          icon="shopping_bag"
          title="Express your fashion sense by shopping!"
        />
        <q-route-tab
          to="/community"
          label="Community"
          icon="message"
          title="Join other users talking in the chat or the forums!"
        />
        <q-route-tab
          to="/games"
          label="Games"
          icon="gamepad"
          title="Try out our games in the game tab"
        />
        <q-route-tab
          to="/rankings"
          label="Rankings"
          icon="leaderboard"
          title="Rankings of the users"
        />
        <q-route-tab
          to="/help"
          label="Support"
          icon="contact_support"
          title="Do you need help? Click here."
        />
      </q-tabs>
      <q-toolbar v-if="isAuthenticated">
        <q-tabs align="left">
          <q-route-tab :to="'/profiles/1'" label="Profile"></q-route-tab>
          <q-route-tab to="/payments" label="currency"></q-route-tab>
        </q-tabs>
        <q-tabs style="position: absolute; right: 0">
          <q-btn @click="logoutPrompt" label="Logout" flat />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { auth } from "src/boot/firebase";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
      productName: "Aswerys",
      mode: ref(false),
      isAuthenticated: auth.currentUser !== null,
      user: {},
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
    logoutPrompt() {
      let ask = confirm("Are you sure you want to log out?");
      if (ask) {
        if (auth.currentUser) {
          signOut(auth)
            .then(() => {
              // Sign-out successful.
              this.$router.push("/login");
            })
            .catch((error) => {
              // An error happened.
              alert(error);
            });
        } else {
          this.$router.push("/login");
        }
      } else {
        return;
      }
    },
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
