import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getMedicines, markMedicineAsTaken } from '../services/medicineService';
import { playAlarmSound, requestNotificationPermission, showDesktopNotification } from '../services/alarmService';
import AlarmModal from '../components/AlarmModal';

const AlarmContext = createContext(null);

export const AlarmProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeAlarmMedicine, setActiveAlarmMedicine] = useState(null);
  const [alertedMinuteMap, setAlertedMinuteMap] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAlarms = async () => {
      try {
        const medicines = await getMedicines();
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        medicines.forEach((med) => {
          if (med.status === 'ACTIVE' && med.reminderTime) {
            const formattedMedTime = med.reminderTime.substring(0, 5);
            const alertKey = `${med.id}_${currentTime}`;

            if (formattedMedTime === currentTime && !alertedMinuteMap[alertKey]) {
              playAlarmSound();
              showDesktopNotification(
                `⏰ Medicine Reminder: ${med.name}`,
                `Time to take ${med.dosage} (${med.frequency}).`
              );
              setActiveAlarmMedicine(med);
              setAlertedMinuteMap((prev) => ({ ...prev, [alertKey]: true }));
            }
          }
        });
      } catch (e) {
        // Silent catch for background alarm checks
      }
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, alertedMinuteMap]);

  const handleMarkTaken = async (id) => {
    try {
      await markMedicineAsTaken(id);
      setActiveAlarmMedicine(null);
    } catch (e) {
      alert('Failed to mark medicine as taken.');
    }
  };

  const handleDismiss = () => {
    setActiveAlarmMedicine(null);
  };

  return (
    <AlarmContext.Provider value={{ activeAlarmMedicine, handleMarkTaken, handleDismiss }}>
      {children}
      <AlarmModal
        alarmMedicine={activeAlarmMedicine}
        onMarkTaken={handleMarkTaken}
        onDismiss={handleDismiss}
      />
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => useContext(AlarmContext);
