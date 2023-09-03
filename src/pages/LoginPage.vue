<template>
  <q-page padding>
    <div class="container">
      <!-- LOGIN FORM -->
      <div v-if="!register" class="login_form">
        <q-input
          ref="email"
          class="input_field"
          type="email"
          outlined
          v-model="email"
          placeholder="Email"
          ><template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-input
          ref="password"
          class="input_field"
          type="password"
          outlined
          v-model="password"
          placeholder="Password"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <p
          align="center"
          style="text-decoration: underline; cursor: pointer"
          @click="switchForm"
        >
          Don't have an account?
        </p>
        <q-btn
          :color="$q.dark.isActive ? 'primary' : 'dark'"
          :label="btnLabel"
          style="width: 100px"
          @click="submit"
        ></q-btn>
      </div>

      <!-- REGISTER FORM -->
      <div v-else class="register_form">
        <q-input
          ref="username"
          class="input_field"
          type="text"
          outlined
          v-model="username"
          label="Username"
          :rules="[required, shortUsername, isUsernameTaken]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          ref="password"
          class="input_field"
          :type="passwordFieldType"
          outlined
          v-model="password"
          label="Password"
          :rules="[required, shortPassword]"
          ><template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="visibilityIcon"
              @click="switchVisibility"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
          ref="repassword"
          class="input_field"
          :type="passwordFieldType"
          outlined
          v-model="repassword"
          label="Password again"
          :rules="[required, shortPassword, diffPassword]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="visibilityIcon"
              @click="switchVisibility"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-input
          ref="email"
          class="input_field"
          type="text"
          outlined
          v-model="email"
          label="Email"
          :rules="[required, isEmail]"
          :style="inputStyle"
          :key="emailValidationKey"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <p
          align="center"
          style="text-decoration: underline; cursor: pointer; margin-top: 10px"
          @click="switchForm"
        >
          Already have an account?
        </p>
        <q-btn
          :color="$q.dark.isActive ? 'primary' : 'dark'"
          :label="btnLabel"
          style="width: 100px"
          @click="submit"
        ></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import {
  ref as dbRef,
  set,
  get,
  update,
  onValue,
  child,
  getDatabase,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { auth, database } from "../boot/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default {
  data() {
    return {
      username: ref(""),
      email: ref(""),
      password: ref(""),
      repassword: ref(""),
      register: ref(false),
      passwordFieldType: "password",
      visibility: ref(false),
      visibilityIcon: "visibility",
      btnLabel: "Log in",
      isEmailValid: true,
      emailValidationKey: 1,
      takenUsername: "",
    };
  },
  computed: {
    inputStyle() {
      return {
        "margin-bottom": this.isEmailValid !== true ? "30px" : "0",
      };
    },
  },
  methods: {
    isUsernameTaken(val) {
      const usernameRef = dbRef(database, "users");
      onValue(
        usernameRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            if (val === childData.username) {
              this.dbUsername = childData.username;
            }
          });
        },
        {
          onlyOnce: false,
        }
      );
      return (val && val != this.dbUsername) || "Username already taken";
    },
    required(val) {
      return (val && val.length > 0) || "This is required.";
    },
    diffPassword(val) {
      const val2 = this.password;
      return (val && val === val2) || "Your password doesn't match!";
    },
    shortPassword(val) {
      return (val && val.length > 5) || "Too short";
    },
    shortUsername(val) {
      return (val && val.length > 1) || "Too short";
    },
    isEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

      const commonEmailProviders = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        //TODO: add more email providers per requests?
      ];

      if (!emailPattern.test(val) || val.length <= 3) {
        this.isEmailValid = false;
        return "Please provide a valid email address";
      }

      const domain = val.split("@")[1];
      if (!commonEmailProviders.includes(domain.toLowerCase())) {
        this.isEmailValid = false;
        return "Please use a more commonly used email provider (check support for help)";
      }
      this.isEmailValid = true;
      return true;
    },
    submit() {
      if (this.register) {
        this.$refs.email.validate();
        this.$refs.username.validate();
        this.$refs.password.validate();
        this.$refs.repassword.validate();

        const usernameRef = dbRef(database, "users");
        onValue(
          usernameRef,
          (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              if (this.username === childData.username) {
                this.takenUsername = childData.username;
              }
            });
          },
          {
            onlyOnce: true,
          }
        );

        if (this.takenUsername === this.username) {
          this.showNotification(
            "close",
            "This username is already taken!",
            "negative"
          );
          return;
        } else {
          createUserWithEmailAndPassword(
            auth,
            this.$refs.email.modelValue,
            this.$refs.password.modelValue
          )
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              set(dbRef(database, "users/" + user.uid), {
                username: this.$refs.username.modelValue,
                email: this.$refs.email.modelValue,
                status: { banned: false, banReasoning: "" },
              })
                .then(() => {
                  // Data saved successfully!
                  this.showNotification(
                    "done",
                    "User created successfully!",
                    "positive"
                  );
                  this.username = "";
                  this.password = "";
                  this.repassword = "";
                  this.switchForm();
                })
                .catch((error) => {
                  // The write failed...
                  alert(error);
                });
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
              // ..
            });
        }
      } else {
        this.$refs.email.validate();
        this.$refs.password.validate();
        signInWithEmailAndPassword(
          auth,
          this.$refs.email.modelValue,
          this.$refs.password.modelValue
        )
          .then((userCredential) => {
            // Signed in
            let lgDate = new Date();
            const user = userCredential.user;
            update(dbRef(database, "users/" + user.uid), {
              last_login: lgDate,
            })
              .then(() => {
                // Data saved successfully!
                this.$router.push("/");
              })
              .catch((error) => {
                // The write failed...
                alert(error);
              });
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
          });
      }
    },
    switchForm() {
      this.register = !this.register;
      this.btnLabel = this.register ? "Sign up" : "Log in";
    },
    switchVisibility() {
      this.visibility = !this.visibility;
      this.passwordFieldType = this.visibility ? "text" : "password";
      this.visibilityIcon = this.visibility ? "visibility_off" : "visibility";
    },
  },
  setup() {
    const $q = useQuasar();

    return {
      showNotification(icon, message, color) {
        $q.notify({
          icon,
          message,
          color,
        });
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 200%;
  display: flex;
  justify-content: center;
}
.login_form,
.register_form {
  width: 300px;
  text-align: center;
}
.input_field {
  padding: 3px;
  margin-top: 17px;
  margin-bottom: 17px;
}
</style>
