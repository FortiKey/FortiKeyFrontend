/**
 * Utility functions for processing analytics data from the backend
 */

/**
 * Safely extracts TOTP statistics from backend response
 * 
 * @param {Object} data - Response data from getTOTPStats API
 * @returns {Object} Normalized TOTP statistics
 */
export const processTOTPStats = (data) => {
  if (!data) return { summary: {}, dailyStats: [] };

  // Extract summary data, handling different possible structures
  const summary = {
    totalSetups: data.summary?.totalSetups || 0,
    totalValidations: data.summary?.totalValidations || 0,
    setupSuccessRate: data.summary?.setupSuccessRate || '0%',
    validationSuccessRate: data.summary?.validationSuccessRate || '0%',
    totalBackupCodesUsed: data.summary?.totalBackupCodesUsed || 0
  };

  // Extract daily stats 
  let dailyStats = [];

  if (Array.isArray(data)) {
    // Handle the case where the response is directly an array
    dailyStats = data;
  } else if (Array.isArray(data.dailyStats)) {
    dailyStats = data.dailyStats;
  } else if (data.stats && Array.isArray(data.stats)) {
    dailyStats = data.stats;
  }

  return { summary, dailyStats };
};

/**
 * Safely extracts failure analytics from backend response
 * 
 * @param {Object} data - Response data from getFailureAnalytics API
 * @returns {Object} Normalized failure statistics
 */
export const processFailureAnalytics = (data) => {
  if (!data) return { totalEvents: 0, totalFailures: 0, failureRate: '0%', failures: [] };

  // Extract summary data with better fallbacks
  const summary = {
    totalEvents: data.totalEvents || data.summary?.totalEvents || 0,
    totalFailures: data.totalFailures || data.summary?.totalFailures || 0,
    failureRate: data.failureRate || data.summary?.failureRate || '0%'
  };

  // Extract failures data with more robust handling
  let failures = [];

  if (Array.isArray(data.failures)) {
    failures = data.failures;
  } else if (Array.isArray(data.failuresByType)) {
    failures = data.failuresByType;
  } else if (data.failuresByType && typeof data.failuresByType === 'object') {
    // Transform object to array format if needed
    failures = Object.entries(data.failuresByType).map(([type, count]) => ({
      _id: { eventType: type },
      count
    }));
  } else if (Array.isArray(data)) {
    // If the response is directly an array of MongoDB aggregation results
    failures = data;

    // Recalculate summary stats from the array data
    const totalFailures = failures.reduce((sum, item) => sum + (item.count || 0), 0);
    summary.totalFailures = totalFailures;
    summary.totalEvents = Math.max(summary.totalEvents, totalFailures); // Keep existing value if higher
    summary.failureRate = summary.totalEvents > 0 ?
      ((summary.totalFailures / summary.totalEvents) * 100).toFixed(2) + '%' : '0%';
  }

  // Calculate total failures from failure breakdown if summary is missing or zero
  if (summary.totalFailures === 0 && failures.length > 0) {
    summary.totalFailures = failures.reduce((total, failure) => total + (failure.count || 0), 0);

    // Update failure rate if we have events
    if (summary.totalEvents > 0) {
      summary.failureRate = ((summary.totalFailures / summary.totalEvents) * 100).toFixed(2) + '%';
    }
  }

  return { ...summary, failures };
};

/**
 * Safely extracts device breakdown from backend response
 * 
 * @param {Object} data - Response data from getDeviceBreakdown API
 * @returns {Object} Normalized device statistics
 */
export const processDeviceBreakdown = (data) => {
  if (!data) return { deviceTypes: {}, browsers: {}, detailedBreakdown: [] };

  let deviceTypes = {};
  let browsers = {};
  let detailedBreakdown = [];

  // Handle different possible response structures
  if (data.deviceTypes && typeof data.deviceTypes === 'object') {
    deviceTypes = data.deviceTypes;
  }

  if (data.browsers && typeof data.browsers === 'object') {
    browsers = data.browsers;
  }

  if (Array.isArray(data.detailedBreakdown)) {
    detailedBreakdown = data.detailedBreakdown;
  } else if (Array.isArray(data)) {
    // If the response is directly an array
    detailedBreakdown = data;

    // Extract device types and browsers from the array
    deviceTypes = detailedBreakdown.reduce((acc, item) => {
      const type = item._id?.deviceType || 'Unknown';
      acc[type] = (acc[type] || 0) + (item.count || 0);
      return acc;
    }, {});

    browsers = detailedBreakdown.reduce((acc, item) => {
      const browser = item._id?.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + (item.count || 0);
      return acc;
    }, {});
  }

  return { deviceTypes, browsers, detailedBreakdown };
};

/**
 * Safely extracts company statistics from backend response
 * 
 * @param {Object} data - Response data from getCompanyStats API
 * @returns {Object} Normalized company statistics
 */
export const processCompanyStats = (data) => {
  if (!data) return { summary: {}, stats: [] };

  // Extract summary data
  const summary = {
    totalEvents: data.summary?.totalEvents || 0,
    successfulEvents: data.summary?.successfulEvents || 0,
    failedEvents: data.summary?.failedEvents || 0,
    successRate: data.summary?.successRate || '0%'
  };

  // Extract stats data
  let stats = [];

  if (Array.isArray(data.stats)) {
    stats = data.stats;
  } else if (Array.isArray(data)) {
    stats = data;
  }

  return { summary, stats };
};

/**
 * Safely extracts backup code usage data from backend response
 * 
 * @param {Object} data - Response data from getBackupCodeUsage API
 * @returns {Object} Normalized backup code usage statistics
 */
export const processBackupCodeUsage = (data) => {
  if (!data) return {
    summary: {},
    backupCodeStats: [],
    frequentBackupUsers: []
  };

  // Extract summary data
  const summary = {
    totpCount: data.totpCount || 0,
    backupCount: data.backupCount || 0,
    backupToTotpRatio: data.backupToTotpRatio || '0%'
  };

  // Extract backup code stats
  let backupCodeStats = [];

  if (Array.isArray(data.backupCodeStats)) {
    backupCodeStats = data.backupCodeStats;
  } else if (Array.isArray(data.backupCodeUsage)) {
    backupCodeStats = data.backupCodeUsage;
  }

  // Extract frequent backup users
  let frequentBackupUsers = [];

  if (Array.isArray(data.frequentBackupUsers)) {
    frequentBackupUsers = data.frequentBackupUsers;
  }

  return { summary, backupCodeStats, frequentBackupUsers };
};

/**
 * Formats a value for display in the UI
 * 
 * @param {*} value - The value to format
 * @param {string} type - The type of formatting to apply ('number', 'percentage', 'date')
 * @returns {string} Formatted value
 */
export const formatValue = (value, type = 'number') => {
  if (value === undefined || value === null) return 'N/A';

  switch (type) {
    case 'percentage':
      // If value is already a string with % sign
      if (typeof value === 'string' && value.includes('%')) {
        return value;
      }
      // Otherwise, format as percentage
      return `${parseFloat(value).toFixed(1)}%`;

    case 'date':
      if (!(value instanceof Date)) {
        value = new Date(value);
      }
      return value.toLocaleDateString();

    case 'number':
    default:
      // If it's a large number, format with commas
      if (typeof value === 'number' && value >= 1000) {
        return value.toLocaleString();
      }
      return String(value);
  }
};