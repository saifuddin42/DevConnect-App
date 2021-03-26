import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((a) => (
      <div key={a.id} className={`alert alert-${a.alertType}`}>
        {a.msg}
      </div>
    ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// Use when you want to fetch redux state into a component.
const mapStateToProps = (state) => ({
  alerts: state.alert, // mapping the redux state to the props in this component
});

export default connect(mapStateToProps)(Alert);
