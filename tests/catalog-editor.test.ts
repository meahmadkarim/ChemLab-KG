import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../src/features/experiments/public-catalog.json";
import { experimentEditorSchema } from "../src/features/experiments/editor-schema";
const text = {en:"Reason",ru:"Объяснение",ky:"Түшүндүрмө"};
function editable(index=0) {const experiment=structuredClone(catalog[index]);return {...experiment,quiz:experiment.quiz.map(q=>({...q,options:q.options.map((o,i)=>({...o,isCorrect:i===0,explanation:text}))}))};}
test("all seed lessons can be edited through the full schema",()=>{for(let i=0;i<catalog.length;i++){const result=experimentEditorSchema.safeParse(editable(i));assert.ok(result.success,result.success?"":JSON.stringify(result.error.issues));}});
test("quiz editor rejects ambiguous correct answers and duplicate question IDs",()=>{const experiment=editable();experiment.quiz[0].options[1].isCorrect=true;assert.equal(experimentEditorSchema.safeParse(experiment).success,false);const duplicate=editable();duplicate.quiz.push(duplicate.quiz[0]);assert.equal(experimentEditorSchema.safeParse(duplicate).success,false);});
