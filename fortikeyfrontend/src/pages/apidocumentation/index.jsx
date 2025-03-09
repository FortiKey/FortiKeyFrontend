import {
  Box,
  useTheme,
  Typography,
  Button,
  useMediaQuery,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import { useToast } from "../../context";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * API Documentation Page Component
 *
 * Provides comprehensive documentation for using the FortiKey API.
 * Features:
 * - Organized sections with expandable accordions
 * - In-page documentation with code examples
 * - Downloadable PDF documentation
 * - Responsive design for mobile and desktop
 * - User feedback via toast notifications
 */
const ApiDocumentation = () => {
  const theme = useTheme();
  const colors = tokens();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSuccessToast } = useToast();

  /**
   * Handle documentation download
   * Shows a toast notification when download starts
   *
   * @param {number} part - The documentation part number being downloaded
   */
  const handleDownload = (part) => {
    showSuccessToast(`Documentation Part ${part} download started`);
    // No tracking call needed
  };

  // Code examples
  const createTOTPSecretExample = `// Create a new TOTP secret for a user
fetch('https://fortikeybackend.onrender.com/api/v1/totp-secrets', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    company: 'Your Company Name',
    externalUserId: 'user123'
  })
})
.then(response => response.json())
.then(data => {
  // Generate QR code from data.uri
  // Show backup codes to user
  console.log(data);
})
.catch(error => console.error('Error:', error));`;

  const validateTOTPExample = `// Validate a TOTP token
fetch('https://fortikeybackend.onrender.com/api/v1/totp-secrets/validate', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    externalUserId: 'user123',
    token: '123456' // 6-digit code from authenticator app
  })
})
.then(response => {
  if (response.ok) {
    // Token is valid, proceed with login
    return true;
  } else {
    // Token is invalid
    return false;
  }
})
.catch(error => console.error('Error:', error));`;

  const validateBackupCodeExample = `// Validate a backup code
fetch('https://fortikeybackend.onrender.com/api/v1/totp-secrets/validate-backup-code', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    externalUserId: 'user123',
    backupCode: 'F3GHT7'
  })
})
.then(response => response.json())
.then(data => {
  if (data.message === 'Backup code is valid') {
    // Backup code is valid, proceed with login
    console.log('Remaining codes:', data.remainingCodes);
    return true;
  } else {
    // Backup code is invalid
    return false;
  }
})
.catch(error => console.error('Error:', error));`;

  const regenerateBackupCodesExample = `// Regenerate backup codes
fetch('https://fortikeybackend.onrender.com/api/v1/totp-secrets/user/user123/regenerate-backup', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
})
.then(response => response.json())
.then(data => {
  // Show new backup codes to user
  console.log(data.backupCodes);
})
.catch(error => console.error('Error:', error));`;

  return (
    <Box m={{ xs: "10px", sm: "20px" }}>
      {/* Page header */}
      <Header
        title="API Documentation"
        subtitle="How to use the FortiKey 2FA API"
      />

      {/* Introduction */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, color: colors.neutral.main }}>
          Introduction
        </Typography>
        <Typography component="p">
          FortiKey provides a secure and easy-to-implement Two-Factor Authentication (2FA) API
          that allows businesses to protect user accounts with Time-based One-Time Passwords (TOTP).
          This documentation provides detailed information about how to integrate the FortiKey 2FA API
          into your applications.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<OpenInNewIcon />}
            component="a"
            href="/assets/fortikeydocs.pdf"
            download="fortikeydocs.pdf"
            onClick={() => handleDownload('complete')}
          >
            Download Complete Documentation
          </Button>
        </Box>
      </Paper>

      {/* Authentication & API Basics */}
      <Accordion defaultExpanded={false} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            1. Authentication & API Basics
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" sx={{ mb: 1, color: colors.neutral.main }}>
              Authentication
            </Typography>
            <Typography component="p">
              All API requests must include your API key in the <code>X-API-Key</code> header.
              You can generate and manage your API keys from the FortiKey dashboard.
            </Typography>

            <Box sx={{ backgroundColor: colors.primary.main, p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="code" sx={{ fontFamily: 'monospace' }}>
                X-API-Key: your_api_key_here
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 1, color: colors.neutral.main }}>
              Base URL
            </Typography>
            <Typography component="p">
              All API endpoints are relative to the following base URL:
            </Typography>

            <Box sx={{ backgroundColor: colors.primary.main, p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="code" sx={{ fontFamily: 'monospace' }}>
                https://api.fortikey.com/api/v1
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 1, color: colors.neutral.main }}>
              Rate Limiting
            </Typography>
            <Typography component="p">
              API endpoints are subject to rate limiting to protect the service from abuse:
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Endpoint Type</strong></TableCell>
                    <TableCell><strong>Rate Limit</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Standard endpoints</TableCell>
                    <TableCell>100 requests per 15 minutes per API key</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TOTP validation endpoints</TableCell>
                    <TableCell>10 attempts per 5 minutes per IP address</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography component="p">
              When a rate limit is exceeded, the server responds with HTTP status 429 (Too Many Requests).
            </Typography>

            <Divider sx={{ my: 3 }} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* API Endpoints section */}
      <Accordion defaultExpanded={false} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            2. API Endpoints
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {/* Create TOTP Secret */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip label="POST" sx={{ backgroundColor: colors.pieChart.apiUsage, color: 'white', mr: 1, fontWeight: 'bold' }} />
                <Typography variant="h6" sx={{ color: colors.neutral.main }}>
                  Create TOTP Secret
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                /totp-secrets
              </Typography>

              <Typography component="p">
                Creates a new TOTP secret for a user and generates backup codes.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Request Example:
              </Typography>

              <SyntaxHighlighter language="javascript" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {createTOTPSecretExample}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example:
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px' }}>
                {`{
  "_id": "6095b1c982a43d00156c89ab",
  "secret": "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  "backupCodes": [
    "F3GHT7",
    "9KL4M2",
    "P7RS8T",
    "V5WX3Z",
    "2A7BCD",
    "E9FG5H",
    "J3KL7M",
    "N9PQ2R"
  ],
  "uri": "otpauth://totp/Your%20Company%20Name:user123?secret=ABCDEFGHIJKLMNOPQRSTUVWXYZ234567&issuer=Your%20Company%20Name",
  "companyId": "6095b1c982a43d00156c89aa",
  "metadata": {
    "company": "Your Company Name",
    "createdBy": "John Doe"
  }
}`}
              </SyntaxHighlighter>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Validate TOTP Token */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip label="POST" sx={{ backgroundColor: colors.pieChart.apiUsage, color: 'white', mr: 1, fontWeight: 'bold' }} />
                <Typography variant="h6" sx={{ color: colors.neutral.main }}>
                  Validate TOTP Token
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                /totp-secrets/validate
              </Typography>

              <Typography component="p">
                Validates a TOTP token provided by a user.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Request Example:
              </Typography>

              <SyntaxHighlighter language="javascript" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {validateTOTPExample}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example (Success):
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {`{
  "message": "TOTP token is valid"
}`}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example (Invalid Token):
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px' }}>
                {`{
  "message": "Invalid TOTP token"
}`}
              </SyntaxHighlighter>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Validate Backup Code */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip label="POST" sx={{ backgroundColor: colors.pieChart.apiUsage, color: 'white', mr: 1, fontWeight: 'bold' }} />
                <Typography variant="h6" sx={{ color: colors.neutral.main }}>
                  Validate Backup Code
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                /totp-secrets/validate-backup-code
              </Typography>

              <Typography component="p">
                Validates a backup code provided by a user. Backup codes can only be used once.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Request Example:
              </Typography>

              <SyntaxHighlighter language="javascript" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {validateBackupCodeExample}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example (Success):
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {`{
  "message": "Backup code is valid",
  "remainingCodes": 7
}`}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example (Invalid Code):
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px' }}>
                {`{
  "message": "Invalid backup code"
}`}
              </SyntaxHighlighter>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Regenerate Backup Codes */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip label="POST" sx={{ backgroundColor: colors.pieChart.apiUsage, color: 'white', mr: 1, fontWeight: 'bold' }} />
                <Typography variant="h6" sx={{ color: colors.neutral.main }}>
                  Regenerate Backup Codes
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                /totp-secrets/user/:externalUserId/regenerate-backup
              </Typography>

              <Typography component="p">
                Generates a new set of backup codes for a user. This invalidates all previous backup codes.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Request Example:
              </Typography>

              <SyntaxHighlighter language="javascript" style={tomorrow} customStyle={{ borderRadius: '4px', marginBottom: '16px' }}>
                {regenerateBackupCodesExample}
              </SyntaxHighlighter>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                Response Example:
              </Typography>

              <SyntaxHighlighter language="json" style={tomorrow} customStyle={{ borderRadius: '4px' }}>
                {`{
  "message": "Backup codes regenerated successfully",
  "backupCodes": [
    "A1B2C3",
    "D4E5F6",
    "G7H8I9",
    "J0K1L2",
    "M3N4O5",
    "P6Q7R8",
    "S9T0U1",
    "V2W3X4"
  ]
}`}
              </SyntaxHighlighter>
            </Box>

            <Divider sx={{ my: 3 }} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Implementation Guide */}
      <Accordion defaultExpanded={false} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            3. Implementation Guide
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography component="p">
              This guide outlines the recommended steps for integrating FortiKey 2FA into your application.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: colors.neutral.main }}>
                <SettingsIcon sx={{ mr: 1 }} /> Step 1: Enable 2FA for a User
              </Typography>

              <Typography component="p">
                When a user wants to enable 2FA for their account, you should:
              </Typography>

              <ol>
                <li>
                  <Typography component="p">
                    <strong>Create a TOTP Secret:</strong> Call the <code>POST /totp-secrets</code> endpoint to generate a TOTP secret and backup codes.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Generate a QR Code:</strong> Use the <code>uri</code> from the response to generate a QR code that the user can scan with their authenticator app.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Display Backup Codes:</strong> Show the backup codes to the user and instruct them to save these codes securely. This is the only time the backup codes will be displayed.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Verification Step:</strong> Before completing the setup, request a token from the user's authenticator app and validate it using the <code>POST /totp-secrets/validate</code> endpoint to ensure the setup was successful.
                  </Typography>
                </li>
              </ol>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: colors.neutral.main }}>
                <SettingsIcon sx={{ mr: 1 }} /> Step 2: Validate User's TOTP Input
              </Typography>

              <Typography component="p">
                When a user attempts to log in with 2FA enabled:
              </Typography>

              <ol>
                <li>
                  <Typography component="p">
                    <strong>Primary Authentication:</strong> Authenticate the user with their username/password or other primary method first.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Request TOTP:</strong> If primary authentication is successful, prompt the user for their 6-digit TOTP code.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Validate Code:</strong> Send the code to the <code>POST /totp-secrets/validate</code> endpoint to verify it.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Complete Authentication:</strong> If the code is valid, complete the login process and establish the user's session.
                  </Typography>
                </li>
              </ol>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: colors.neutral.main }}>
                <SettingsIcon sx={{ mr: 1 }} /> Step 3: Handle Backup Codes
              </Typography>

              <Typography component="p">
                If a user loses access to their authenticator app:
              </Typography>

              <ol>
                <li>
                  <Typography component="p">
                    <strong>Provide Backup Option:</strong> Offer an option to log in using a backup code instead of a TOTP.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Validate Backup Code:</strong> Send the backup code to the <code>POST /totp-secrets/validate-backup-code</code> endpoint.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Track Remaining Codes:</strong> The response will include the number of remaining backup codes. If few remain, prompt the user to generate new ones.
                  </Typography>
                </li>
                <li>
                  <Typography component="p">
                    <strong>Consider Reset Flow:</strong> After a backup code login, consider prompting the user to reset their 2FA setup with a new device.
                  </Typography>
                </li>
              </ol>
            </Box>

            <Divider sx={{ my: 3 }} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Security Best Practices */}
      <Accordion defaultExpanded={false} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            4. Security Best Practices
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: colors.neutral.main }}>
              <SecurityIcon sx={{ mr: 1 }} /> API Key Security
            </Typography>
            <Typography component="p">
              Never expose your API key in client-side code. Always make FortiKey API calls from your server.
            </Typography>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3, color: colors.neutral.main }}>
              <SecurityIcon sx={{ mr: 1 }} /> HTTPS Only
            </Typography>
            <Typography component="p">
              Always use HTTPS for all communications with the FortiKey API. This ensures data is encrypted during transit.
            </Typography>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3, color: colors.neutral.main }}>
              <SecurityIcon sx={{ mr: 1 }} /> Rate Limiting
            </Typography>
            <Typography component="p">
              Implement your own rate limiting on top of FortiKey's rate limits to prevent abuse. This helps protect both your system and the API.
            </Typography>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3, color: colors.neutral.main }}>
              <SecurityIcon sx={{ mr: 1 }} /> Backup Code Handling
            </Typography>
            <Typography component="p">
              Store backup codes securely and ensure they are only used once. After a backup code is used, it should be invalidated to prevent reuse.
            </Typography>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3, color: colors.neutral.main }}>
              <SecurityIcon sx={{ mr: 1 }} /> Account Recovery
            </Typography>
            <Typography component="p">
              Implement a robust account recovery process for users who lose access to both their authenticator app and backup codes.
            </Typography>

            <Divider sx={{ my: 3 }} />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ApiDocumentation;