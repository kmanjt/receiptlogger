import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import AuthContext from "../hocs/AuthContext";
import Enactus from "../assets/enactus.png";

const pages = ["receipts"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Appbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { contextData } = useContext(AuthContext);
  const { user, logoutUser } = contextData;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              sx={{
                height: 64,
              }}
              alt="Enactus Logo."
              src={Enactus}
            />
            </Link>
          </IconButton>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Enactus DCU Treasury
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              display={{ xs: "block", md: "none" }}
            >
              <>
                {!user ? (
                  <>
                    <MenuItem key={"/register"} onClick={handleCloseNavMenu}>
                      <Link to="/register" style={{ textDecoration: "none" }}>
                        <Button
                          key={"register"}
                          onClick={handleCloseNavMenu}
                          color="primary"
                          variant="contained"
                          fullWidth
                        >
                          Register
                        </Button>
                      </Link>
                    </MenuItem>

                    <MenuItem key={"/login"} onClick={handleCloseNavMenu}>
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        <Button
                          key={"submit-receipt"}
                          onClick={handleCloseNavMenu}
                          color="primary"
                          variant="contained"
                          fullWidth
                        >
                          Login
                        </Button>
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem key={"/receipts"} onClick={handleCloseNavMenu}>
                      <Link to="/receipts" style={{ textDecoration: "none" }}>
                        <Button
                          key={"submit-receipt"}
                          onClick={handleCloseNavMenu}
                          color="primary"
                          variant="contained"
                          fullWidth
                        >
                          Receipts
                        </Button>
                      </Link>
                    </MenuItem>
                    {user.admin && (
                      <MenuItem key={"/admin"} onClick={handleCloseNavMenu}>
                        <Link to="/admin" style={{ textDecoration: "none" }}>
                          <Button
                            key={"admin"}
                            onClick={handleCloseNavMenu}
                            color="primary"
                            variant="contained"
                            fullWidth
                          >
                            Admin
                          </Button>
                        </Link>
                      </MenuItem>
                    )}

                    <MenuItem key={"/logout"} onClick={handleCloseNavMenu}>
                      <Button
                        key={"logout"}
                        onClick={logoutUser}
                        color="primary"
                        variant="contained"
                        fullWidth
                      >
                        Logout
                      </Button>
                    </MenuItem>
                  </>
                )}
              </>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Enactus DCU Treasury
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <>
              {!user ? (
                <>
                  <Link to="/register" style={{ textDecoration: "none" }}>
                    <Button
                      key={"register"}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Register
                    </Button>
                  </Link>

                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Button
                      key={"submit-receipt"}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/receipts" style={{ textDecoration: "none" }}>
                    <Button
                      key={"submit-receipt"}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Receipts
                    </Button>
                  </Link>
                  {user.admin && (
                    <Link to="/admin" style={{ textDecoration: "none" }}>
                      <Button
                        key={"admin"}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Admin
                      </Button>
                    </Link>
                  )}

                  <Button
                    key={"logout"}
                    onClick={logoutUser}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Appbar;
