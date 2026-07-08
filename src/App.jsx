import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import UserTable from "./components/UserTable";
import ContactUs from "./components/ContactUs";
import "./styles.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="app-main">
        {activePage === "home" ? (
          <>
            <p className="page-eyebrow">Directory</p>

            <h2 className="page-title">
              Contact Management
            </h2>

            <p className="page-sub">
              Add, search,view and delete contact records.
            </p>

            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <UserTable searchTerm={searchTerm} />
          </>
        ) : (
          <ContactUs />
        )}
      </main>
    </div>
  );
}

export default App;