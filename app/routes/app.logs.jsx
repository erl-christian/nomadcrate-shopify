export default function Logs() {
  return (
    <s-page heading="Activity Logs">

      <s-box
        padding="base"
        borderWidth="base"
        borderRadius="base"
      >
        <s-heading>
          Recent Activity
        </s-heading>

        <s-unordered-list>
          <s-list-item>
            Mountain Adventure Bundle created
          </s-list-item>

          <s-list-item>
            City Explorer Bundle updated
          </s-list-item>

          <s-list-item>
            Beach Weekend Bundle archived
          </s-list-item>
        </s-unordered-list>

      </s-box>

    </s-page>
  );
}
