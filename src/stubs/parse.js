import Parse from "parse";

import keys from "../keys"

Parse.initialize(keys.parse.applicationId, keys.parse.javaScriptKey);
export default Parse;
