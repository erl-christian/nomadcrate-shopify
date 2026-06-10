export default function Bundles() {
  return (
    <s-page heading="Bundle Management">

      <s-section heading="Create Bundle">
        <s-button>Create Bundle</s-button>
      </s-section>

      <s-section heading="Existing Bundles">

        <s-box
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-heading>
            Mountain Adventure Bundle
          </s-heading>

          <s-text>
            Score: 92
          </s-text>
        </s-box>

        <s-box
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-heading>
            City Explorer Bundle
          </s-heading>

          <s-text>
            Score: 87
          </s-text>
        </s-box>

      </s-section>

    </s-page>
  );
}
