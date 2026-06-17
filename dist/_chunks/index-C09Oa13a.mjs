import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useCallback, memo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useFetchClient, Page, Layouts } from "@strapi/strapi/admin";
import { Table, Thead, Tr, Th, Checkbox, Tbody, Td, Button, Box, Typography, Flex, Grid, Field, Divider, Dialog, IconButton, Alert, Tabs } from "@strapi/design-system";
import { useIntl } from "react-intl";
import { p as pluginId } from "./index-BGCMT5rK.mjs";
import styled from "styled-components";
import { Check, WarningCircle, Plus, Trash } from "@strapi/icons";
const getTrad = (id) => `${pluginId}.${id}`;
const ButtonWrapper = styled.div`
    margin: 10px 0 0 0;

    & button {
        margin: 0 0 0 auto;
    }
`;
const Description = styled.p`
    font-size: 16px;
    margin: 20px 0;
`;
function Role({ ssoRoles, roles, onSaveRole, onChangeRoleCheck }) {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Table, { colCount: roles.length + 1, rowCount: ssoRoles.length, children: [
      /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Checkbox, { style: { display: "none" } }) }),
        roles.map((role) => /* @__PURE__ */ jsx(Th, { children: role["name"] }, role["id"]))
      ] }) }),
      /* @__PURE__ */ jsx(Tbody, { children: ssoRoles.map((ssoRole) => /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Td, { children: ssoRole["name"] }),
        roles.map((role) => /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: ssoRole["role"] && ssoRole["role"].includes(role["id"]),
            onCheckedChange: (value) => onChangeRoleCheck(value, ssoRole["oauth_type"], role["id"]),
            children: ""
          }
        ) }, role["id"]))
      ] }, ssoRole["oauth_type"])) })
    ] }),
    /* @__PURE__ */ jsx(Description, { children: formatMessage({
      id: getTrad("page.notes"),
      defaultMessage: "This will not be reflected for already registered users."
    }) }),
    /* @__PURE__ */ jsx(ButtonWrapper, { children: /* @__PURE__ */ jsx(Button, { variant: "default", onClick: onSaveRole, children: formatMessage({
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
  const [email, setEmail] = useState("");
  const { formatMessage } = useIntl();
  const onSaveEmail = useCallback(async () => {
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
  const isValidEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Box, { padding: 4, children: [
    /* @__PURE__ */ jsxs(Typography, { tag: "div", children: [
      useWhitelist && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Flex, { children: [
          /* @__PURE__ */ jsx(Check, { color: "green" }),
          " ",
          formatMessage({
            id: getTrad("tab.whitelist.enabled"),
            defaultMessage: "Whitelist is currently enabled."
          }),
          /* @__PURE__ */ jsx("br", {})
        ] }),
        formatMessage({
          id: getTrad("tab.whitelist.description"),
          defaultMessage: "Only the following email addresses are allowed to authenticate with SSO."
        })
      ] }),
      !useWhitelist && /* @__PURE__ */ jsxs(Flex, { children: [
        /* @__PURE__ */ jsx(WarningCircle, { color: "#dd0000" }),
        " ",
        formatMessage({
          id: getTrad("tab.whitelist.disabled"),
          defaultMessage: "Whitelist is currently disabled."
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Grid.Root, { tag: "fieldset", gap: 4, padding: "0px", gridCols: 2, borderWidth: 0, marginTop: 5, marginBottom: 5, children: /* @__PURE__ */ jsxs(Grid.Item, { xs: 1, children: [
      /* @__PURE__ */ jsx(Field.Root, { children: /* @__PURE__ */ jsx(
        Field.Input,
        {
          type: "email",
          disabled: loading,
          value: email,
          hasError: email && !isValidEmail(),
          onChange: (e) => setEmail(e.currentTarget.value)
        }
      ) }),
      " ",
      /* @__PURE__ */ jsx(
        Button,
        {
          startIcon: /* @__PURE__ */ jsx(Plus, {}),
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
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsxs(Table, { colCount: 4, rowCount: users.length, children: [
      /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.no"),
          defaultMessage: "No"
        }) }),
        /* @__PURE__ */ jsx(Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.email"),
          defaultMessage: "Email"
        }) }),
        /* @__PURE__ */ jsx(Th, { children: formatMessage({
          id: getTrad("tab.whitelist.table.created"),
          defaultMessage: "Created At"
        }) }),
        /* @__PURE__ */ jsx(Th, { children: " " })
      ] }) }),
      /* @__PURE__ */ jsx(Tbody, { children: users.map((user) => /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Td, { children: user.id }),
        /* @__PURE__ */ jsx(Td, { children: user.email }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(LocalizedDate, { date: user.createdAt }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Dialog.Root, { children: [
          /* @__PURE__ */ jsx(Dialog.Trigger, { children: /* @__PURE__ */ jsx(IconButton, { label: "Delete", withTooltip: false, children: /* @__PURE__ */ jsx(Trash, {}) }) }),
          /* @__PURE__ */ jsxs(Dialog.Content, { children: [
            /* @__PURE__ */ jsx(Dialog.Header, { children: formatMessage({
              id: getTrad("tab.whitelist.delete.title"),
              defaultMessage: "Confirmation"
            }) }),
            /* @__PURE__ */ jsx(Dialog.Body, { icon: /* @__PURE__ */ jsx(WarningCircle, { fill: "danger600" }), children: /* @__PURE__ */ jsxs(Typography, { variant: "delta", children: [
              formatMessage({
                id: getTrad("tab.whitelist.delete.description"),
                defaultMessage: "Are you sure you want to delete this?"
              }),
              /* @__PURE__ */ jsx("br", {}),
              user.email
            ] }) }),
            /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
              /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(Button, { fullWidth: true, variant: "tertiary", children: formatMessage({
                id: getTrad("page.cancel"),
                defaultMessage: "Cancel"
              }) }) }),
              /* @__PURE__ */ jsx(Dialog.Action, { children: /* @__PURE__ */ jsx(Button, { fullWidth: true, variant: "danger-light", onClick: () => onDelete(user.id), children: formatMessage({
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
const AlertMessage = styled.div`
    margin-left: -250px;
    position: fixed;
    left: 50%;
    top: 2.875rem;
    z-index: 10;
    width: 31.25rem;
`;
function SuccessAlertMessage({ onClose: onClose2 }) {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(AlertMessage, { children: /* @__PURE__ */ jsx(
    Alert,
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
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(AlertMessage, { children: /* @__PURE__ */ jsx(
    Alert,
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
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const [ssoRoles, setSSORoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [useWhitelist, setUseWhitelist] = useState(false);
  const [users, setUsers] = useState([]);
  const [showSuccess, setSuccess] = useState(false);
  const [showError, setError] = useState(false);
  const { get, put, post, del } = useFetchClient();
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs(Page.Protect, { permissions: [{ action: "plugin::strapi-plugin-sso.read", subject: null }], children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        title: "Single Sign On",
        subtitle: formatMessage({
          id: getTrad("page.title"),
          defaultMessage: "Default role setting at first login"
        })
      }
    ),
    showSuccess && /* @__PURE__ */ jsx(SuccessAlertMessage, { onClose: () => setSuccess(false) }),
    showError && /* @__PURE__ */ jsx(ErrorAlertMessage, { onClose: () => setError(false) }),
    /* @__PURE__ */ jsx(Box, { padding: 10, children: /* @__PURE__ */ jsxs(Tabs.Root, { defaultValue: "role", children: [
      /* @__PURE__ */ jsxs(Tabs.List, { "aria-label": "Manage your attribute", style: { maxWidth: 300 }, children: [
        /* @__PURE__ */ jsx(Tabs.Trigger, { value: "role", children: formatMessage({
          id: getTrad("tab.roles"),
          defaultMessage: "Roles"
        }) }),
        /* @__PURE__ */ jsx(Tabs.Trigger, { value: "whitelist", children: formatMessage({
          id: getTrad("tab.whitelist"),
          defaultMessage: "Whitelist"
        }) })
      ] }),
      /* @__PURE__ */ jsx(Tabs.Content, { value: "role", style: { background: "initial" }, children: /* @__PURE__ */ jsx(
        Role,
        {
          roles,
          ssoRoles,
          onSaveRole,
          onChangeRoleCheck
        }
      ) }),
      /* @__PURE__ */ jsx(Tabs.Content, { value: "whitelist", children: /* @__PURE__ */ jsx(
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
const HomePage$1 = memo(HomePage);
const App = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage$1, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] }) });
};
export {
  App as default
};
