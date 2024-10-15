<template>
  <div>
    <ods-main-header
      headerLogoText="Onesait sla-tools"
      logoUrl="/"
      breadcrumbSeparator=">"
      actionsMenuIcon="overflow-menu"
      :showBreadcrumbs="true"
      :topBarBorder="false"
      :showUserMenu="true"
      :userMenuText="user ? user : 'User'"
      ref="header"
      :environment="enviroment"
    >
      <template slot="notifications">
        <ods-select v-model="$i18n.locale">
          <ods-option
            v-for="lang in langs"
            :key="lang"
            :value="lang"
            :label="getLabel(lang)"
          ></ods-option>
        </ods-select>
      </template>

      <template slot="user">
        <ul class="ods-actions-menu__ul ods-actions-menu--user__ul">
          <!-- <li>
            <router-link :to="{ name: 'Profile' }">
              <span data-name="OdsIcon" class="ods-icon-user"></span>Profile
            </router-link>
          </li> -->
          <li class="cursor-pointer">
            <a @click="logout()">
              <span data-name="OdsIcon" class="ods-icon-logout"></span>
              Logout {{ $router.history.path }}
            </a>
          </li>
        </ul>
      </template>
    </ods-main-header>
    <div class="app-wrap">
      <ods-main-navigation
        :collapsed="false"
        :navigation="navigation"
        ref="navigation"
      ></ods-main-navigation>
      <ods-main>
        <ods-scrollbar wrapClass="ods-scrollbar--main-content">
          <router-view />
        </ods-scrollbar>
        <ods-backtop
          :target="'.ods-scrollbar--main-content'"
          :visibilityHeight="200"
          :right="30"
          :bottom="30"
        >
          <ods-button
            size="small"
            icon="ods-icon-chevron-up"
            circle
            class="py-0"
          />
        </ods-backtop>
      </ods-main>
    </div>
  </div>
</template>

<script>
import navigationConfig from "./nav-config.json";
import defaultPicture from "../../public/avatar.b30248d4.svg";
import { mapState } from "vuex";

export default {
  name: "Private",
  computed: {
    langs() {
      return Object.keys(this.$i18n.messages);
    },
    ...mapState({
      userData: (state) => state.user.data,
    }),
  },
  async mounted() {
    this.getUser();
  },
  data() {
    return {
      navigation: navigationConfig,
      wrapClass: "",
      user: null,
      loading: false,
      enviroment: `${process.env.VUE_APP_ENVIRONMENT}-v${process.env.VUE_APP_VERSION}`,
      defaultProfilePicture: defaultPicture,
    };
  },

  methods: {
    getLabel(lang) {
      return this.mobile
        ? this.$i18n.messages[lang].labelMobile
        : this.$i18n.messages[lang].label;
    },
    logout() {
      this.$store.commit("user/logout");
      this.$router.push({ path: "/auth/login" });
    },
    getUser() {
      this.user = this.userData.email;
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        const assignName = (item) => {
          this.$set(item, "name", item.langs[this.$i18n.locale]);
          if (item.children && Object.keys(item.children).length) {
            for (const key in item.children) {
              assignName(item.children[key]);
            }
          }
        };
        for (const key in this.navigation) {
          assignName(this.navigation[key]);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-wrap {
  display: flex;
}

/deep/ .ods-main-header__logo .logo_text h2 {
  font-size: 16px;
  font-weight: 400;
}
</style>
