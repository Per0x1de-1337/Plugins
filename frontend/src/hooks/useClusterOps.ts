import axios from "axios";
import { useState } from "react";

interface OnboardPayload {
  clusterName: string;
  kubeconfig: string;
}

interface Response {
  success: boolean;
  message?: string;
  cluster?: string;
}

interface ClusterStatus {
  name: string;
  status: string;
}

export const useClusterOps = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const onboardCluster = async (payload: OnboardPayload): Promise<Response> => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/plugins/kubestellar-cluster-plugin/onboard",
        payload
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const detachCluster = async (clusterName: string): Promise<Response> => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/plugins/kubestellar-cluster-plugin/detach",
        { clusterName }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const getClusterStatus = async (): Promise<ClusterStatus[]> => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/plugins/kubestellar-cluster-plugin/status"
      );
      setLoading(false);
      return response.data.clusters || [];
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { onboardCluster, detachCluster, getClusterStatus, loading };
};
