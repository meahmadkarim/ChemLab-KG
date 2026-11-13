"use client";
import { useEffect, useState } from "react";
import type { RankedRecommendation } from "./recommendation-service";
export function useRecommendations(slug:string) {
 const [recommendations,setRecommendations]=useState<RankedRecommendation[]>([]);
 useEffect(()=>{let active=true;const refresh=()=>{void fetch(`/api/recommendations?currentExperimentSlug=${encodeURIComponent(slug)}`,{cache:"no-store"}).then(async response=>{if(!response.ok)return;const data=await response.json();if(active)setRecommendations(data.recommendations);}).catch(()=>undefined);};refresh();window.addEventListener("chemlab-auth-updated",refresh);window.addEventListener("chemlab-save-success",refresh);return()=>{active=false;window.removeEventListener("chemlab-auth-updated",refresh);window.removeEventListener("chemlab-save-success",refresh);};},[slug]);
 return recommendations;
}
