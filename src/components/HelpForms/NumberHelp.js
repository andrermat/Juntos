import { connect } from "react-redux";
import { mapStateToProps } from "../../store/store";
import Icon from "../UI/Icon";

const NumberHelp = () => {
  return (
    <div>
      <Icon xmnls="" viewBox="" fill="" d="" />
      <p>Number of helps (store)</p>
    </div>
  );
};

export default connect(mapStateToProps)(NumberHelp);