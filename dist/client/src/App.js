import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardHome from "./pages/DashboardHome";
import MediaPage from "./pages/MediaPage";
import ImportProductsPage from "./pages/ImportProductsPage";
import ProductsPage from "./pages/ProductsPage";
import VideosPage from "./pages/VideosPage";
import VideoEditorPage from "./pages/VideoEditorPage";
import CarouselsPage from "./pages/CarouselsPage";
import CarouselEditorPage from "./pages/CarouselEditorPage";
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/", replace: true });
}
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LoginPage, {}) }), _jsxs(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardHome, {}) }), _jsx(Route, { path: "media", element: _jsx(MediaPage, {}) }), _jsx(Route, { path: "import", element: _jsx(ImportProductsPage, {}) }), _jsx(Route, { path: "products", element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "videos", element: _jsx(VideosPage, {}) }), _jsx(Route, { path: "videos/new", element: _jsx(VideoEditorPage, {}) }), _jsx(Route, { path: "videos/edit/:id", element: _jsx(VideoEditorPage, {}) }), _jsx(Route, { path: "carousels", element: _jsx(CarouselsPage, {}) }), _jsx(Route, { path: "carousels/new", element: _jsx(CarouselEditorPage, {}) }), _jsx(Route, { path: "carousels/edit/:id", element: _jsx(CarouselEditorPage, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { className: "flex flex-col items-center justify-center py-24 gap-3", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "P\u00E1gina em constru\u00E7\u00E3o." }) }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
