import { useState } from "react";
import { setup2FA, verify2FA, disable2FA } from "../../services/api";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./TwoFactor.module.css";

const STATUS = {
  IDLE: "idle",
  SETUP: "setup",
};

const TwoFactor = ({ user, setUser }) => {
  const [qrCode, setQrCode] = useState(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState("");

  // Update user + persist
  const updateUser2FA = (enabled) => {
    const updatedUser = { ...user, isTwoFactorEnabled: enabled };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleEnable = async () => {
    try {
      setMessage("");
      const res = await setup2FA();
      setQrCode(res.data.qrcode);
      setStatus(STATUS.SETUP);
    } catch (err) {
      console.error("Setup Error:", err);
      setMessage("Could not load QR Code.");
    }
  };

  const handleVerify = async () => {
    if (token.length !== 6) return;

    try {
      const res = await verify2FA(token);

      updateUser2FA(true);

      setStatus(STATUS.IDLE);
      setQrCode(null);
      setToken("");

      setMessage(res.data.message);
    } catch (err) {
      console.error("Verify Error:", err);
      setMessage("Invalid code. Please try again.");
    }
  };

  const handleDisable = async () => {
    try {
      await disable2FA();
      updateUser2FA(false);
      setMessage("Two-factor authentication has been disabled.");
    } catch (err) {
      console.error("Disable Error:", err);
      setMessage("Error disabling two-factor authentication.");
    }
  };

  // Cancel setup and reset state
  const handleCancel = () => {
    setStatus(STATUS.IDLE);
    setQrCode(null);
    setToken("");
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <h3>Two-Factor Authentication</h3>
      {user.isTwoFactorEnabled ? (  
        <div className={styles.enabledState}>
          <p className={styles.badge}>
            Status: <strong>Active</strong>
          </p>
          <p>Your account is protected with two-factor authentication.</p>
          <Button variant="danger" size="sm" onClick={handleDisable}>
            Disable 2FA
          </Button>
        </div>
      ) : (
        <div className={styles.disabledState}>
          {status === STATUS.IDLE && (
            <>
              <p>Add an extra layer of security to your account.</p>
              <Button onClick={handleEnable}>Enable 2FA</Button>
            </>
          )}
          {status === STATUS.SETUP && qrCode && (
            <div className={styles.setupBox}>
              <p>1. Scan this QR code using Google Authenticator:</p>

              <img
                src={qrCode}
                alt="Two-factor authentication QR code"
                className={styles.qr}
              />

              <p>2. Enter the 6-digit code:</p>

              <div className={styles.verifyRow}>
                <Input
                  placeholder="123456"
                  value={token}
                  onChange={(e) =>
                    setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                />

                <Button onClick={handleVerify} disabled={token.length !== 6}>
                  Verify & Enable
                </Button>
              </div>

              <button className={styles.cancelLink} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default TwoFactor;
