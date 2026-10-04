export const settingItems = [
  { id: 1, name: "Account", value: "account" },
  { id: 2, name: "Notifications", value: "notification" },
  { id: 3, name: "Credentials", value: "credentials" },
];

export const types = [
  { label: "Farmer", value: "Farmer" },
  { label: "Seller", value: "Seller" },
];

export const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
].map((value) => ({ label: value, value }));

export type SettingsFormData = {
  u_name: string;
  u_surname: string;
  u_email: string;
  u_tel: string;
  u_type: string[];
  u_district: string[];
  u_notify: boolean;
};
