import React, { useContext } from "react";
import { Link } from "@reach/router";
import { Segment, Container, Grid } from "semantic-ui-react";

import { Context } from "../Context";

const Logout = () => {
  const { removeAuth } = useContext(Context);
  removeAuth();

  return (
    <div class="ui text container" style={{marginTop: 50}}>
      <div class="ui segments">
          <div className="ui segment center aligned">
                <h1>Cerraste sesion</h1>
                <h3>Te vamos a extrañar :(</h3>
                <Link to="/auth" className="ui primary button"> Volver a ingresar </Link>
          </div>
      </div>
    </div>
  );
};
export default Logout;
