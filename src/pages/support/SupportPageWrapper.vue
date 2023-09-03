<template>
  <q-page>
    <q-page-container style="padding: 0">
      <component :is="$route.meta.dynamicComponent"></component>
    </q-page-container>
  </q-page>
</template>

<script>
export default {
  name: "SupportPageWrapper",
  beforeRouteUpdate(to, from, next) {
    // Perform actions here when the route changes.
    // You can update the dynamic component in the meta object.

    const id = to.params.id;
    let dynamicComponent;

    switch (id) {
      case "1":
        dynamicComponent = () => import("pages/support/BasicInfo.vue");
        break;
      case "2":
        dynamicComponent = () => import("pages/support/ContactInfo.vue");
        break;
      case "3":
        dynamicComponent = () => import("pages/support/PaymentsHelp.vue");
        break;
      case "4":
        dynamicComponent = () => import("pages/support/RulesPage.vue");
        break;
      default:
        dynamicComponent = () => import("pages/ErrorNotFound.vue");
    }

    // Load the dynamic component and update the meta.dynamicComponent.
    dynamicComponent()
      .then((resolvedComponent) => {
        to.meta.dynamicComponent =
          resolvedComponent.default || resolvedComponent;
        next();
      })
      .catch(() => {
        next();
      });
  },
};
</script>
