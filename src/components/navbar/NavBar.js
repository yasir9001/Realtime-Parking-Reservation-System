import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  } from 'reactstrap';

export default class Topbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      style:'normal'
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand >Realtime Parking App</NavbarBrand>
          {this.props.link5?
            <NavbarToggler onClick={this.toggle} />
          : null}
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.link1?<NavItem>
                <NavLink  href={this.props.link1Target} style={this.props.style} >{this.props.link1} </NavLink>
              </NavItem> : null}
              {this.props.link2?<NavItem>
                <NavLink href={this.props.link2Target} style={this.props.style}>{this.props.link2}</NavLink>
              </NavItem>: null}

              {this.props.link3?<NavItem>
                <NavLink href={this.props.link3Target} style={this.props.style}>{this.props.link3}</NavLink>
              </NavItem>: null}

              {this.props.link4?<NavItem>
                <NavLink href={this.props.link4Target } style={this.props.style}>{this.props.link4}</NavLink>
              </NavItem>: null}
                {
                  this.props.link6?<NavItem>
                  <NavLink href={this.props.link6Target } style={this.props.style}>{this.props.link6}</NavLink>
                </NavItem>: null
                }
              {this.props.link5?<NavItem>
                <NavLink onClick={this.props.logout } style={this.props.style}>{this.props.link5}</NavLink>
              </NavItem>: null}

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}