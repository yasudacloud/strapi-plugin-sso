"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const reactRouterDom = require("react-router-dom");
const admin = require("@strapi/strapi/admin");
const designSystem = require("@strapi/design-system");
const reactIntl = require("react-intl");
const index = require("./index-BFqpFqpc.js");
const styled = require("styled-components");
const icons = require("@strapi/icons");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const getTrad = (id) => `${index.pluginId}.${id}`;
const ButtonWrapper = styled__default.default.div`
    margin: 10px 0 0 0;

    & button {
        margin: 0 0 0 auto;
    }
`;
const Description = styled__default.default.p`
    font-size: 16px;
    margin: 20px 0;
`;
function Role({ ssoRoles, roles, onSaveRole, onChangeRoleCheck }) {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { colCount: roles.length + 1, rowCount: ssoRoles.length, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Checkbox, { style: { display: "none" } }) }),
        roles.map((role) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: role["name"] }, role["id"]))
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: ssoRoles.map((ssoRole) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: ssoRole["name"] }),
        roles.map((role) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Checkbox,
          {
            checked: ssoRole["role"] && ssoRole["role"].includes(role["id"]),
            onCheckedChange: (value) => onChangeRoleCheck(value, ssoRole["oauth_type"], role["id"]),
            children: ""
          }
        ) }, role["id"]))
      ] }, ssoRole["oauth_type"])) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Description, { children: formatMessage({
      id: getTrad("page.notes"),
      defaultMessage: "This will not be reflected for already registered users."
    }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ButtonWrapper, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "default", onClick: onSaveRole, children: formatMessage({
      id: getTrad("page.save"),
      defaultMessage: "Save"
    }) }) })
  ] });
}
const LocalizedDate = ({ date }) => {
  const userLocale = navigator.language || "en-US";
  return new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
};
function Whitelist({ users, useWhitelist, loading, onSave, onDelete }) {
  const [email, setEmail] = react.useState("");
  const { formatMessage } = reactIntl.useIntl();
  const onSaveEmail = react.useCallback(async () => {
    const emailText = email.trim();
    if (users.some((user) => user.email === emailText)) {
      alert(
        formatMessage({
          id: getTrad("tab.whitelist.error.unique"),
          defaultMessage: "Already registered email address."
        })
      );
    } else {
      await onSave(emailText);
      setEmail("");
    }
  }, [email, users]);
  const isValidEmail = react.useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { padding: 4, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { tag: "div", children: [
      useWhitelist && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.Check, { color: "green" }),
          " ",
          formatMessage({
            id: getTrad("tab.whitelist.enabled"),
            defaultMessage: "Whitelist is currently enabled."
          }),
          /* @__PURE__ */ jsxRuntime.jsx("br", {})
        ] }),
        formatMessage({
          id: getTrad("tab.whitelist.description"),
          defaultMessage: "Only the following email addresses are allowed to authenticate with SSO."
        })
      ] }),
      !useWhitelist && /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { color: "#dd0000" }),
        " ",
        formatMessage({
          id: getTrad("tab.whitelist.disabled"),
          defaultMessage: "Whitelist is currently disabled."
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { tag: "fieldset", gap: 4, padding: "0px", gridCols: 2, borderWidth: 0, marginTop: 5, marginBottom: 5, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Item, { xs: 1, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Root, { children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Field.Input,
        {
          type: "email",
          disabled: loading,
          value: email,
          hasError: email && !isValidEmail(),
          onChange: (e) => setEmail(e.currentTarget.value)
        }
      ) }),
      " ",
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
          disabled: loading || email.trim() === "" || !isValidEmail(),
          loading,
          onClick: onSaveEmail,
          children: formatMessage({
            id: getTrad("page.save"),
            defaultMessage: "Save"
          })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { colCount: 4, rowCount: users.length, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.no"),
          defaultMessage: "No"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.email"),
          defaultMessage: "Email"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.created"),
          defaultMessage: "Created At"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: " " })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: users.map((user) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: user.id }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: user.email }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(LocalizedDate, { date: user.createdAt }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Root, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Trigger, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.IconButton, { label: "Delete", withTooltip: false, children: /* @__PURE__ */ jsxRuntime.jsx(icons.Trash, {}) }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Content, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Header, { children: formatMessage({
              id: getTrad("tab.whitelist.delete.title"),
              defaultMessage: "Confirmation"
            }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Body, { icon: /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { fill: "danger600" }), children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "delta", children: [
              formatMessage({
                id: getTrad("tab.whitelist.delete.description"),
                defaultMessage: "Are you sure you want to delete this?"
              }),
              /* @__PURE__ */ jsxRuntime.jsx("br", {}),
              user.email
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Footer, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Cancel, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { fullWidth: true, variant: "tertiary", children: formatMessage({
                id: getTrad("page.cancel"),
                defaultMessage: "Cancel"
              }) }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Action, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { fullWidth: true, variant: "danger-light", onClick: () => onDelete(user.id), children: formatMessage({
                id: getTrad("page.ok"),
                defaultMessage: "OK"
              }) }) })
            ] })
          ] })
        ] }) })
      ] }, user.id)) })
    ] })
  ] }) });
}
const AlertMessage = styled__default.default.div`
    margin-left: -250px;
    position: fixed;
    left: 50%;
    top: 2.875rem;
    z-index: 10;
    width: 31.25rem;
`;
function SuccessAlertMessage({ onClose: onClose2 }) {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(AlertMessage, { children: /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Alert,
    {
      title: "Success",
      variant: "success",
      closeLabel: "",
      onClose: onClose2,
      children: formatMessage({
        id: getTrad("page.save.success"),
        defaultMessage: "Updated settings"
      })
    }
  ) });
}
function ErrorAlertMessage() {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(AlertMessage, { children: /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Alert,
    {
      title: "Error",
      variant: "danger",
      closeLabel: "",
      onClose,
      children: formatMessage({
        id: getTrad("page.save.error"),
        defaultMessage: "Update failed."
      })
    }
  ) });
}
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const [loading, setLoading] = react.useState(false);
  const [ssoRoles, setSSORoles] = react.useState([]);
  const [roles, setRoles] = react.useState([]);
  const [useWhitelist, setUseWhitelist] = react.useState(false);
  const [users, setUsers] = react.useState([]);
  const [showSuccess, setSuccess] = react.useState(false);
  const [showError, setError] = react.useState(false);
  const { get, put, post, del } = admin.useFetchClient();
  react.useEffect(() => {
    get(`/strapi-plugin-sso/sso-roles`).then((response) => {
      setSSORoles(response.data);
    });
    get(`/admin/roles`).then((response) => {
      setRoles(response.data.data);
    });
    get("/strapi-plugin-sso/whitelist").then((response) => {
      setUsers(response.data.whitelistUsers);
      setUseWhitelist(response.data.useWhitelist);
    });
  }, [setSSORoles, setRoles]);
  const onChangeRoleCheck = (value, ssoId, role) => {
    for (const ssoRole of ssoRoles) {
      if (ssoRole["oauth_type"] === ssoId) {
        if (ssoRole["role"]) {
          if (value) {
            ssoRole["role"].push(role);
          } else {
            ssoRole["role"] = ssoRole["role"].filter((selectRole) => selectRole !== role);
          }
        } else {
          ssoRole["role"] = [role];
        }
      }
    }
    setSSORoles(ssoRoles.slice());
  };
  const onSaveRole = async () => {
    try {
      await put("/strapi-plugin-sso/sso-roles", {
        roles: ssoRoles.map((role) => ({
          "oauth_type": role["oauth_type"],
          role: role["role"]
        }))
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3e3);
    } catch (e) {
      console.error(e);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3e3);
    }
  };
  const onRegisterWhitelist = async (email) => {
    setLoading(true);
    post("/strapi-plugin-sso/whitelist", {
      email
    }).then((response) => {
      get("/strapi-plugin-sso/whitelist").then((response2) => {
        setUsers(response2.data.whitelistUsers);
        setUseWhitelist(response2.data.useWhitelist);
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3e3);
    });
  };
  const onDeleteWhitelist = async (id) => {
    setLoading(true);
    del(`/strapi-plugin-sso/whitelist/${id}`).then((response) => {
      get("/strapi-plugin-sso/whitelist").then((response2) => {
        setUsers(response2.data.whitelistUsers);
        setUseWhitelist(response2.data.useWhitelist);
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3e3);
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(admin.Page.Protect, { permissions: [{ action: "plugin::strapi-plugin-sso.read", subject: null }], children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      admin.Layouts.Header,
      {
        title: "Single Sign On",
        subtitle: formatMessage({
          id: getTrad("page.title"),
          defaultMessage: "Default role setting at first login"
        })
      }
    ),
    showSuccess && /* @__PURE__ */ jsxRuntime.jsx(SuccessAlertMessage, { onClose: () => setSuccess(false) }),
    showError && /* @__PURE__ */ jsxRuntime.jsx(ErrorAlertMessage, { onClose: () => setError(false) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 10, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.Root, { defaultValue: "role", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.List, { "aria-label": "Manage your attribute", style: { maxWidth: 300 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "role", children: formatMessage({
          id: getTrad("tab.roles"),
          defaultMessage: "Roles"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "whitelist", children: formatMessage({
          id: getTrad("tab.whitelist"),
          defaultMessage: "Whitelist"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "role", style: { background: "initial" }, children: /* @__PURE__ */ jsxRuntime.jsx(
        Role,
        {
          roles,
          ssoRoles,
          onSaveRole,
          onChangeRoleCheck
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "whitelist", children: /* @__PURE__ */ jsxRuntime.jsx(
        Whitelist,
        {
          loading,
          users,
          useWhitelist,
          onSave: onRegisterWhitelist,
          onDelete: onDeleteWhitelist
        }
      ) })
    ] }) })
  ] });
};
const HomePage$1 = react.memo(HomePage);
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage$1, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] }) });
};
exports.default = App;
