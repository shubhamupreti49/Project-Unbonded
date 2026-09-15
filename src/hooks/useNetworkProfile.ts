import { useEffect, useState } from 'react';

/**
 * Reads the Network Information API so heavy embeds can wait for an explicit tap on
 * slow or metered connections — common for readers in remote districts on 2G/3G.
 *
 * Support: Chrome/Edge/Samsung Internet on Android (the majority of mobile browsers in
 * Nepal). Safari and Firefox don't expose it; there we assume an unconstrained network
 * and rely on lazy loading instead.
 */
type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g';

type NetworkInformation = EventTarget & {
  effectiveType?: EffectiveType;
  saveData?: boolean;
  downlink?: number;
};

export type NetworkProfile = {
  saveData: boolean;
  effectiveType: EffectiveType | 'unknown';
  /** True when Data Saver is on or the connection is 2G-class or slower. */
  isConstrained: boolean;
};

function getConnection(): NetworkInformation | undefined {
  return typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function readProfile(): NetworkProfile {
  const connection = getConnection();
  const saveData = Boolean(connection?.saveData);
  const effectiveType = connection?.effectiveType ?? 'unknown';
  return { saveData, effectiveType, isConstrained: saveData || effectiveType === 'slow-2g' || effectiveType === '2g' };
}

export function useNetworkProfile(): NetworkProfile {
  const [profile, setProfile] = useState(readProfile);

  useEffect(() => {
    const connection = getConnection();
    if (!connection) return undefined;
    const update = () => setProfile(readProfile());
    connection.addEventListener('change', update);
    return () => connection.removeEventListener('change', update);
  }, []);

  return profile;
}
