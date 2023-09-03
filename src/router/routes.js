const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/profiles/:profileId",
        component: () => import("pages/ProfilePage.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "settings",
            component: () => import("pages/SettingsPage.vue"),
          },
        ],
      },
      {
        path: "/store",
        component: () => import("pages/StorePage.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/community",
        component: () => import("pages/CommunityPage.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "forums",
            component: () => import("pages/ForumsPage.vue"),
            children: [
              {
                path: "list",
                component: () => import("pages/ForumList.vue"),
                children: [
                  {
                    path: "thread",
                    component: () => import("pages/ForumThread.vue"),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/games",
        component: () => import("pages/GamesPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/rankings",
        component: () => import("pages/RankingsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/payments",
        component: () => import("pages/PaymentPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/help",
    component: () => import("layouts/HelpLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        component: () => import("pages/HelpPage.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/support/SupportPageWrapper.vue"),
        beforeEnter: (to, from, next) => {
          const id = to.params.id;
          let dynamicComponent;

          switch (id) {
            case "1":
              dynamicComponent = import("pages/support/BasicInfo.vue");
              break;
            case "2":
              dynamicComponent = import("pages/support/ContactInfo.vue");
              break;
            case "3":
              dynamicComponent = import("pages/support/PaymentsHelp.vue");
              break;
            case "4":
              dynamicComponent = import("pages/support/RulesPage.vue");
              break;
            default:
              dynamicComponent = import("pages/ErrorNotFound.vue");
          }
          dynamicComponent
            .then((resolvedComponent) => {
              to.meta.dynamicComponent =
                resolvedComponent.default || resolvedComponent;
              next();
            })
            .catch(() => {
              next();
            });
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
