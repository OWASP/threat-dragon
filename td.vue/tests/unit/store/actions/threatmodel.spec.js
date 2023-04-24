import {
  THREATMODEL_CLEAR,
  THREATMODEL_CREATE,
  THREATMODEL_DIAGRAM_SELECTED,
  THREATMODEL_FETCH,
  THREATMODEL_FETCH_ALL,
  THREATMODEL_SELECTED,
  THREATMODEL_CONTRIBUTORS_UPDATED,
  THREATMODEL_RESTORE,
  THREATMODEL_SET_IMMUTABLE_COPY,
  THREATMODEL_SAVE,
  THREATMODEL_UPDATE
} from '@/stores/actions/threatmodel.js';

describe('stores/actions/threatmodel.js', () => {
  it('defines a clear action', () => {
    expect(THREATMODEL_CLEAR).not.toBeUndefined();
  });

  it('defines a fetch action', () => {
    expect(THREATMODEL_FETCH).not.toBeUndefined();
  });

  it('defines a fetch all action', () => {
    expect(THREATMODEL_FETCH_ALL).not.toBeUndefined();
  });

  it('defines a selected action', () => {
    expect(THREATMODEL_SELECTED).not.toBeUndefined();
  });

  it('defines a diagram selected action', () => {
    expect(THREATMODEL_DIAGRAM_SELECTED).not.toBeUndefined();
  });

  it('defines a create action', () => {
    expect(THREATMODEL_CREATE).not.toBeUndefined();
  });

  it('defines a contributors updated action', () => {
    expect(THREATMODEL_CONTRIBUTORS_UPDATED).not.toBeUndefined();
  });

  it('defines a restore action', () => {
    expect(THREATMODEL_RESTORE).not.toBeUndefined();
  });

  it('defines a set immutable copy action', () => {
    expect(THREATMODEL_SET_IMMUTABLE_COPY).not.toBeUndefined();
  });

  it('defines a save action', () => {
    expect(THREATMODEL_SAVE).not.toBeUndefined();
  });

  it('defines an update action', () => {
    expect(THREATMODEL_UPDATE).not.toBeUndefined();
  });
});
