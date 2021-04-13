import { getBits, toBitArray } from '../utils/functions';

export default function parse(sysex) {
  const patch = build_patch(sysex.slice(0, 38));
  switch (patch.voice_mode) {
    default:
    case 0:
      return [
        { ...patch },
        { ...build_timbre(1, sysex.slice(38, 146)) },
        null,
        null,
      ];

    case 2:
      return [
        { ...patch },
        { ...build_timbre(1, sysex.slice(38, 146)) },
        { ...build_timbre(2, sysex.slice(146, 254)) },
        null,
      ];
    case 3:
      return [
        { ...patch },
        null,
        null,
        { ...build_vocoder(sysex.slice(38, 142)) },
      ];
  }
}

function build_patch(patch) {
  return {
    /* BYTES 0, 11 NOT 0, 12 */
    program_name: String.fromCharCode(...patch.slice(0, 12)),
    /* BYTES 12 / 13 SKIPPED */
    arp_trigger_length: patch[14],
    arp_trigger_pattern: toBitArray(patch[15]),
    voice_mode: getBits(patch[16], 4, 5),
    scale_key: getBits(patch[17], 4, 7),
    scale_type: getBits(patch[17], 0, 3),
    /* BYTE 18 SKIPPED */
    delay_sync: patch[19] & 0x80,
    delay_timebase: getBits(patch[19], 0, 3),
    delay_time: patch[20],
    delay_depth: patch[21],
    delay_type: patch[22],
    mod_lfo_speed: patch[23],
    mod_depth: patch[24],
    mod_type: patch[25],
    eq_hi_freq: patch[26],
    eq_hi_gain: patch[27],
    eq_low_freq: patch[28],
    eq_low_gain: patch[29],
    arp_tempo: (patch[30] << 8) + patch[31],
    arp_on_off: patch[32] & 0x80,
    arp_latch: patch[32] & 0x40,
    arp_target: getBits(patch[32], 4, 5),
    arp_key_sync: patch[32] & 0x01,
    arp_type: getBits(patch[33], 0, 3),
    arp_range: getBits(patch[33], 4, 7),
    arp_gate_time: patch[34],
    arp_resolution: patch[35],
    arp_swing: patch[36],
    keyboard_octave: patch[37],
  };
}

function build_timbre(num, timbre) {
  return {
    [`t${num}_midi_channel`]: timbre[0],
    [`t${num}_assign_mode`]: getBits(timbre[1], 6, 7),
    [`t${num}_eg_2_reset`]: timbre[1] & 0x20,
    [`t${num}_eg_1_reset`]: timbre[1] & 0x10,
    [`t${num}_trigger_mode`]: timbre[1] & 0x08,
    [`t${num}_key_priority`]: getBits(timbre[1], 0, 1),
    [`t${num}_unison_detune`]: timbre[2],
    [`t${num}_tune`]: timbre[3],
    [`t${num}_bend_range`]: timbre[4],
    [`t${num}_transpose`]: timbre[5],
    [`t${num}_vibrato_int`]: timbre[6],
    [`t${num}_osc_1_wave`]: timbre[7],
    [`t${num}_osc_1_ctrl_1`]: timbre[8],
    [`t${num}_osc_1_ctrl_2`]: timbre[9],
    [`t${num}_osc_1_dgws`]: timbre[10],
    /* SKIP BYTE 11 */
    [`t${num}_osc_2_mod_select`]: getBits(timbre[12], 4, 5),
    [`t${num}_osc_2_wave`]: getBits(timbre[12], 0, 1),
    [`t${num}_osc_2_semitone`]: timbre[13],
    [`t${num}_osc_2_tune`]: timbre[14],
    [`t${num}_portamento`]: getBits(timbre[15], 0, 6),
    [`t${num}_osc_1_level`]: timbre[16],
    [`t${num}_osc_2_level`]: timbre[17],
    [`t${num}_noise_level`]: timbre[18],
    [`t${num}_filter_type`]: timbre[19],
    [`t${num}_filter_cutoff`]: timbre[20],
    [`t${num}_filter_resonance`]: timbre[21],
    [`t${num}_filter_eg_intensity`]: timbre[22],
    [`t${num}_filter_vel_sense`]: timbre[23],
    [`t${num}_filter_key_track`]: timbre[24],
    [`t${num}_amp_level`]: timbre[25],
    [`t${num}_amp_panpot`]: timbre[26],
    [`t${num}_amp_switch`]: timbre[27] & 0x40,
    [`t${num}_amp_distortion`]: timbre[27] & 0x01,
    [`t${num}_amp_vel_sense`]: timbre[28],
    [`t${num}_amp_key_track`]: timbre[29],
    [`t${num}_eg_1_attack`]: timbre[30],
    [`t${num}_eg_1_decay`]: timbre[31],
    [`t${num}_eg_1_sustain`]: timbre[32],
    [`t${num}_eg_1_release`]: timbre[33],
    [`t${num}_eg_2_attack`]: timbre[34],
    [`t${num}_eg_2_decay`]: timbre[35],
    [`t${num}_eg_2_sustain`]: timbre[36],
    [`t${num}_eg_2_release`]: timbre[37],
    [`t${num}_lfo_1_key_sync`]: getBits(timbre[38], 4, 5),
    [`t${num}_lfo_1_wave`]: getBits(timbre[38], 0, 1),
    [`t${num}_lfo_1_frequency`]: timbre[39],
    [`t${num}_lfo_1_tempo_sync`]: timbre[40] & 0x80,
    [`t${num}_lfo_1_sync_note`]: getBits(timbre[40], 0, 4),
    [`t${num}_lfo_2_key_sync`]: getBits(timbre[41], 4, 5),
    [`t${num}_lfo_2_wave`]: getBits(timbre[41], 0, 1),
    [`t${num}_lfo_2_frequency`]: timbre[42],
    [`t${num}_lfo_2_tempo_sync`]: timbre[43] & 0x80,
    [`t${num}_lfo_2_sync_note`]: getBits(timbre[43], 0, 4),
    [`t${num}_patch_1_dest`]: getBits(timbre[44], 4, 7),
    [`t${num}_patch_1_src`]: getBits(timbre[44], 0, 3),
    [`t${num}_patch_1_intensity`]: timbre[45],
    [`t${num}_patch_2_dest`]: getBits(timbre[46], 4, 7),
    [`t${num}_patch_2_src`]: getBits(timbre[46], 0, 3),
    [`t${num}_patch_2_intensity`]: timbre[47],
    [`t${num}_patch_3_dest`]: getBits(timbre[48], 4, 7),
    [`t${num}_patch_3_src`]: getBits(timbre[48], 0, 3),
    [`t${num}_patch_3_intensity`]: timbre[49],
    [`t${num}_patch_4_dest`]: getBits(timbre[50], 4, 7),
    [`t${num}_patch_4_src`]: getBits(timbre[50], 0, 3),
    [`t${num}_patch_4_intensity`]: timbre[51],
  };
}

function build_vocoder(vocoder) {
  return {
    v_midi_channel: vocoder[0],
    v_assign_mode: getBits(vocoder[1], 6, 7),
    v_eg_2_reset: vocoder[1] & 0x20,
    v_eg_1_reset: vocoder[1] & 0x10,
    v_trigger_mode: vocoder[1] & 0x08,
    v_key_priority: getBits(vocoder[1], 0, 1),
    v_unison_detune: vocoder[2],
    v_tune: vocoder[3],
    v_bend_range: vocoder[4],
    v_transpose: vocoder[5],
    v_vibrato_int: vocoder[6],
    v_osc_wave: vocoder[7],
    v_osc_ctrl_1: vocoder[8],
    v_osc_ctrl_2: vocoder[9],
    v_osc_dgws: vocoder[10],
    /* BYTE 11 SKIPPED */
    v_audio_in_hpf_gate: vocoder[12] & 0x01,
    /* BYTE 13 SKIPPED */
    v_portamento_time: getBits(vocoder[14], 0, 6),
    v_osc_level: vocoder[15],
    v_ext_level: vocoder[16],
    v_noise_level: vocoder[17],
    v_audio_in_hpf_level: vocoder[18],
    v_audio_in_gate_sense: vocoder[19],
    v_audio_in_threshold: vocoder[20],
    v_filter_shift: vocoder[21],
    v_filter_cutoff: vocoder[22],
    v_filter_resonance: vocoder[23],
    v_filter_mod_source: vocoder[24],
    v_filter_intensity: vocoder[25],
    v_filter_e_f_sense: vocoder[26],
    v_amp_level: vocoder[27],
    v_amp_direct_level: vocoder[28],
    v_amp_distortion: vocoder[29] & 0x01,
    v_amp_vel_sense: vocoder[30],
    v_amp_key_track: vocoder[31],
    v_eg_1_attack: vocoder[32],
    v_eg_1_decay: vocoder[33],
    v_eg_1_sustain: vocoder[34],
    v_eg_1_release: vocoder[35],
    v_eg_2_attack: vocoder[36],
    v_eg_2_decay: vocoder[37],
    v_eg_2_sustain: vocoder[38],
    v_eg_2_release: vocoder[39],
    v_lfo_1_key_sync: getBits(vocoder[40], 4, 5),
    v_lfo_1_wave: getBits(vocoder[40], 0, 1),
    v_lfo_1_frequency: vocoder[41],
    v_lfo_1_tempo_sync: vocoder[42] & 0x80,
    v_lfo_1_sync_note: getBits(vocoder[42], 0, 4),
    v_lfo_2_key_sync: getBits(vocoder[43], 4, 5),
    v_lfo_2_wave: getBits(vocoder[43], 0, 1),
    v_lfo_2_frequency: vocoder[44],
    v_lfo_2_tempo_sync: vocoder[45] & 0x80,
    v_lfo_2_sync_note: getBits(vocoder[45], 0, 4),
    v_level_1: vocoder[46],
    v_level_2: vocoder[47],
    v_level_3: vocoder[48],
    v_level_4: vocoder[49],
    v_level_5: vocoder[50],
    v_level_6: vocoder[51],
    v_level_7: vocoder[52],
    v_level_8: vocoder[53],
    v_pan_1: vocoder[62],
    v_pan_2: vocoder[63],
    v_pan_3: vocoder[64],
    v_pan_4: vocoder[65],
    v_pan_5: vocoder[66],
    v_pan_6: vocoder[67],
    v_pan_7: vocoder[68],
    v_pan_8: vocoder[69],
  };
}
