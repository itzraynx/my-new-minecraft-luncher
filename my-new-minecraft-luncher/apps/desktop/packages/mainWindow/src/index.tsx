import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { WelcomeDashboard } from "./components/WelcomeDashboard";
import { InstanceCreationWizard } from "./components/InstanceCreationWizard";
import { ModStoreHomepage } from "./pages/Search/ModStoreHomepage";
import { InstanceStats } from "./components/InstanceStats";
import { JavaManager } from "./components/JavaManager";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Route path="/" component={WelcomeDashboard} />
      <Route path="/create" component={InstanceCreationWizard} />
      <Route path="/mods" component={ModStoreHomepage} />
      <Route path="/stats" component={() => <InstanceStats instanceId="demo" />} />
      <Route path="/java" component={JavaManager} />
    </Router>
  );
}

render(() => <App />, document.getElementById("root")!);
