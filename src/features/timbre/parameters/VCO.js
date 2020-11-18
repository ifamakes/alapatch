import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectById, parameterUpdated } from './parameterSlice.js';
import { Slider, SelectList } from '../../helpers/Helpers';

export default function VCO(props) {
    const parameters = useSelector((state) => selectById(state, props.id));

    const dispatch = useDispatch();
    return (
        <div>
            <SelectList
                value={parameters.waveform}
                list={props.waveforms}
                onChange={(value) =>
                    dispatch(
                        parameterUpdated({
                            id: props.id,
                            changes: { waveform: value },
                        })
                    )
                }
            />
            <SelectList
                value={parameters.dwgsOrModType}
                list={props.dwgsOrModType}
                onChange={(value) =>
                    dispatch(
                        parameterUpdated({
                            id: props.id,
                            changes: { dwgsOrModType: value },
                        })
                    )
                }
            />
            <Slider
                min="0"
                max="100"
                parameter={parameters.waveMod}
                onChange={(value) =>
                    dispatch(
                        parameterUpdated({
                            id: props.id,
                            changes: { waveMod: value },
                        })
                    )
                }
            />
            <Slider
                min="0"
                max="100"
                parameter={parameters.lfoMod}
                onChange={(value) =>
                    dispatch(
                        parameterUpdated({
                            id: props.id,
                            changes: { lfoMod: value },
                        })
                    )
                }
            />
        </div>
    );
}
