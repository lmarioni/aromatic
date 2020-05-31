import React from 'react'
import {
  Container,
  Image,
  Menu
} from 'semantic-ui-react';

import Logo from "../../assets/img/logo/logo.png";

export const NavBar = () => (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src={Logo} style={{ marginRight: '1.5em' }} />
          Aromatic
        </Menu.Item>
        <Menu.Item as='a'>Inicio</Menu.Item>
      </Container>
    </Menu>
)
