import { Box, Tabs, Button, Typography, Tab } from "@mui/material";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./styles/sidebar.css";

const TABS = ["User", "Planner", "Collection"];

interface LinkTabProps {
    label: string;
    href?: string;
    selected?: boolean;
}

const LinkTab = ({ label, ...props }: LinkTabProps) => {
    const navigate = useNavigate();
    // const IconComponent = iconMap[label.toLowerCase().replace(/\s/g, "")];

    return (
        <Tab
            className="navTab"
            iconPosition="start"
            // icon={IconComponent && <IconComponent />}
            component="a"
            onClick={(
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
                event.preventDefault();
                navigate(props.href!);
            }}
            aria-current={props.selected && "page"}
            sx={{
                "&.Mui-selected .navTabText": { color: "#1976d2" },
                "&.Mui-selected": { bgcolor: "#e3f2fd" },
            }}
            label={
                <Typography align={"left"} className="navTabText">
                    {label}
                </Typography>
            }
            {...props}
        />
    );
};

const Layout: React.FC = () => {
    const [curPage, setCurPage] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newPage: number) => {
        setCurPage(newPage);
    };

    return (
        <Box className="root-container">
            <Box sx={{ display: "flex" }}>
                <Box
                    sx={{
                        flex: "0 0 15%",
                        borderRight: 1,
                        borderColor: "divider",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Tabs
                        value={curPage}
                        onChange={handleChange}
                        aria-label="nav tabs"
                        role="navigation"
                        orientation="vertical"
                        className="tabsContainer"
                    >
                        {TABS.map((caption, index) => (
                            <LinkTab
                                key={index}
                                label={caption}
                                href={`/${caption.replace(/\s/g, "")}`}
                            />
                        ))}
                    </Tabs>
                    <Button
                        sx={{ marginButton: "auto" }}
                        // onClick={handleLogout}
                    >
                        Logout
                    </Button>
                    <Box className="appInfoContainer">
                        <Typography className="appNameText">
                            LettuceEat
                        </Typography>
                        <Typography className="versionText">
                            Version 1.0.0
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, p: 3 }} className="page-container">
                    <Typography variant="h5" className="page-title">
                        {TABS[curPage]}
                    </Typography>
                    {<Outlet />}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
